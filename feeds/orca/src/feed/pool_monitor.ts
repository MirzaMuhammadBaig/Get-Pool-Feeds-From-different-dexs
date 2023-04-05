import Decimal from "decimal.js";
import { deserializeAccount, OrcaPool, Quote } from "@orca-so/sdk";
import { Connection, AccountInfo, Context } from "@solana/web3.js";
import {
  initPoolToken,
  UPDATE_TIMER,
  OrcaPoolMonitorCallback,
  PoolToken,
  PriceUpdate,
  UPDATE_TYPE,
  QuoteParams,
} from "../utils";

import { u64 } from "@solana/spl-token";
import { BN } from "@project-serum/anchor";
import { OrcaPoolParams } from "@orca-so/sdk/dist/model/orca/pool/pool-types";
import { QuoteBuilderFactory } from "@orca-so/sdk/dist/model/quote/quote-builder";
import { defaultSlippagePercentage } from "@orca-so/sdk/dist/constants";

export class OrcaPoolMonitor {
  private connection: Connection;
  private pool: OrcaPool;
  private callback: OrcaPoolMonitorCallback;
  private tokenA: PoolToken = initPoolToken();
  private tokenB: PoolToken = initPoolToken();
  private updateSlot: number;
  public pair: string;
  public state: PriceUpdate;
  public config: OrcaPoolParams | undefined;

  constructor(
    connection: Connection,
    pool: OrcaPool,
    pair: string,
    slot: number,
    callback: OrcaPoolMonitorCallback,
    config?: OrcaPoolParams
  ) {
    this.pool = pool;
    this.callback = callback;
    this.connection = connection;
    this.tokenA.poolToken = this.pool.getTokenA();
    this.tokenA.tokenName = this.pool.getTokenA().tag === "ETH" ? "soETH" : this.pool.getTokenA().tag
    this.tokenB.poolToken = this.pool.getTokenB();
    this.tokenB.tokenName = this.pool.getTokenB().tag === "ETH" ? "soETH" : this.pool.getTokenB().tag
    this.updateSlot = slot;
    this.pair = pair;
    this.config = config;
    this.state = {
      dex: "Orca",
      tokenA: this.tokenA.tokenName,
      tokenB: this.tokenB.tokenName,
      slot: slot,
      bidSize: 0,
      askSize: 0,
      askPrice: 0,
      bidPrice: 0,
      type: UPDATE_TYPE.UPDATE,
    };
  }

  public startMonitoring() {
    this.tokenA.subscriptionID = this.connection.onAccountChange(
      this.tokenA.poolToken.addr,
      this.updateTokenA.bind(this)
    );
    this.tokenB.subscriptionID = this.connection.onAccountChange(
      this.tokenB.poolToken.addr,
      this.updateTokenB.bind(this)
    );
  }

  public async stopMonitoring() {
    await this.connection.removeAccountChangeListener(
      this.tokenA.subscriptionID
    );
    await this.connection.removeAccountChangeListener(
      this.tokenB.subscriptionID
    );
  }

  private async emitPriceUpdate() {
    if (this.tokenA.updateSlot !== this.tokenB.updateSlot) return;

    if (
      this.tokenA.amountEmitted &&
      this.tokenA.amountEmitted.eq(this.tokenA.tokenAmount) &&
      this.tokenB.amountEmitted.eq(this.tokenB.tokenAmount)
    ) {
      return;
    }
    this.tokenA.amountEmitted = this.tokenA.tokenAmount;
    this.tokenB.amountEmitted = this.tokenB.tokenAmount;

    const price = this.tokenB.tokenAmount
      .div(this.tokenA.tokenAmount)
      .toDecimalPlaces(this.tokenB.poolToken.scale)
      .toNumber();
    var quote = undefined;
    if (this.config) {
      const quoteParams = this.buildQuoteParams(
        this.tokenA.tokenAmount,
        this.tokenB.tokenAmount
      );
      quote = this.getQuote(new BN("100"), quoteParams);
    }
    this.updateSlot = this.tokenA.updateSlot;
    this.state = {
      dex: "Orca",
      tokenA: this.tokenA.tokenName,
      tokenB: this.tokenB.tokenName,
      bidPrice: this.config === undefined ? price : quote!.getRate().toNumber(),
      askPrice: this.config === undefined ? price : quote!.getRate().toNumber(),
      bidSize: this.tokenA.tokenAmount.toNumber(),
      askSize: this.tokenB.tokenAmount.toNumber(),
      slot: this.tokenA.updateSlot,
      type: UPDATE_TYPE.CHANGE,
    };
    await this.callback(this.state);
  }

  private updateTokenA(accountInfo: AccountInfo<Buffer>, context: Context) {
    const tokenAccount = deserializeAccount(accountInfo.data);
    if (tokenAccount) {
      this.tokenA.tokenAmount = new Decimal(tokenAccount.amount.toString()).div(
        10 ** this.tokenA.poolToken.scale
      );
      this.tokenA.updateSlot = context.slot;
      this.emitPriceUpdate();
    }
  }

  private updateTokenB(accountInfo: AccountInfo<Buffer>, context: Context) {
    const tokenAccount = deserializeAccount(accountInfo.data);
    if (tokenAccount) {
      this.tokenB.tokenAmount = new Decimal(tokenAccount.amount.toString()).div(
        10 ** this.tokenB.poolToken.scale
      );
      this.tokenB.updateSlot = context.slot;
      this.emitPriceUpdate();
    }
  }

  public async updateState() {
    try {
      const updateSlot = await this.connection.getSlot();
      if (this.updateSlot + UPDATE_TIMER / 500 > updateSlot) {
        return;
      }
      this.updateSlot = updateSlot;

      const accountA_Info = await this.connection.getAccountInfo(
        this.tokenA.poolToken.addr
      );
      const tokenAccount_A = deserializeAccount(accountA_Info!.data);
      if (tokenAccount_A) {
        const tokenAmount_A = new Decimal(tokenAccount_A.amount.toString()).div(
          10 ** this.tokenA.poolToken.scale
        );

        const accountB_Info = await this.connection.getAccountInfo(
          this.tokenB.poolToken.addr
        );
        const tokenAccount_B = deserializeAccount(accountB_Info!.data);
        if (tokenAccount_B) {
          const tokenAmount_B = new Decimal(
            tokenAccount_B.amount.toString()
          ).div(10 ** this.tokenB.poolToken.scale);

          const price = tokenAmount_B
            .div(tokenAmount_A)
            .toDecimalPlaces(this.tokenB.poolToken.scale)
            .toNumber();
          this.state = {
            dex: "Orca",
            tokenA: this.tokenA.tokenName,
            tokenB: this.tokenB.tokenName,
            bidPrice: price,
            askPrice: price,
            bidSize: tokenAmount_A.toNumber(),
            askSize: tokenAmount_B.toNumber(),
            slot: this.updateSlot,
            type: UPDATE_TYPE.UPDATE,
          };

          if (this.config) {
            const quoteParams: QuoteParams = this.buildQuoteParams(
              tokenAmount_A,
              tokenAmount_B
            );
            const quote = this.getQuote(new BN("100"), quoteParams);
            this.state.bidPrice = quote.getRate().toNumber();
            this.state.askPrice = quote.getRate().toNumber();
          }
        }
      }
    } catch (e) {
      console.log(e);
    }
  }
  private buildQuoteParams(
    inputTokenCountRaw: Decimal,
    outputTokenCountRaw: Decimal
  ): QuoteParams {
    return {
      inputToken: this.pool.getTokenA(),
      outputToken: this.pool.getTokenB(),
      inputTokenCount: new BN(
        inputTokenCountRaw
          .mul(10 ** inputTokenCountRaw.decimalPlaces())
          .toString()
      ),
      outputTokenCount: new BN(
        outputTokenCountRaw
          .mul(10 ** outputTokenCountRaw.decimalPlaces())
          .toString()
      ),
      feeStructure: this.config!.feeStructure,
      slippageTolerance: defaultSlippagePercentage,
      lamportsPerSignature: 0,
      amp: new BN("100"),
    };
  }

  private getQuote(inputAmountU64: u64, params: QuoteParams): Quote {
    const quoteBuilder = QuoteBuilderFactory.getBuilder(this.config!.curveType);
    const quote = quoteBuilder!.buildQuote(params, inputAmountU64);
    return quote;
  }
}
