import {
  Connection,
  Context,
  PublicKey,
  Keypair,
  KeyedAccountInfo,
} from "@solana/web3.js";
import {
  WhirlpoolContext,
  ORCA_WHIRLPOOL_PROGRAM_ID,
  buildWhirlpoolClient,
  PriceMath,
  WhirlpoolData,
  ParsableWhirlpool,
} from "@orca-so/whirlpools-sdk";
import { BN, Wallet } from "@project-serum/anchor";
import {
  fulfillWithTimeLimit,
  initializeMarkets,
  UPDATE_TIMER,
  PriceUpdate,
  RPC_ENDPOINT_URL,
  UPDATE_TYPE,
} from "../utils";
import Decimal from "decimal.js";
import { WebSocketConsumer } from "../consumers/websocket";

const WHIRLPOOL_ACCOUNT_SIZE = 653;

export class AllWhirlpoolMonitor {
  public state: Map<string, PriceUpdate>;
  private whirlpoolSymbols: Map<string, [string, string]>;

  private connection: Connection;
  private whirlpool_program: PublicKey;
  private consumer: WebSocketConsumer;
  private subscription_id: number;
  private sqrt_price_emitted: Map<String, BN>;
  private slots: Map<string, number>;

  constructor(
    connection: Connection,
    whirlpool_program: PublicKey,
    consumer: WebSocketConsumer
  ) {
    this.connection = connection;
    this.subscription_id = 0;
    this.sqrt_price_emitted = new Map();
    this.slots = new Map();
    this.whirlpoolSymbols = new Map();
    this.state = new Map();
    this.whirlpool_program = whirlpool_program;
    this.consumer = consumer;
  }

  public async init() {
    this.whirlpoolSymbols = await initializeMarkets();
  }

  public startMonitoring(slot: number) {
    this.sqrt_price_emitted = new Map<String, BN>();
    this.slots = new Map<string, number>();
    for (const key of this.whirlpoolSymbols.keys()) {
      this.slots.set(key, slot);
    }
    // Whirlpool account can be identified by the size
    const filters = [{ dataSize: WHIRLPOOL_ACCOUNT_SIZE }];
    this.subscription_id = this.connection.onProgramAccountChange(
      this.whirlpool_program,
      this.updateWhirlpool.bind(this),
      this.connection.commitment,
      filters
    );
    // send updates after fixed time period
    setInterval(() => {
      this.updateStates();
    }, UPDATE_TIMER);
  }

  public async stopMonitoring() {
    await this.connection.removeProgramAccountChangeListener(
      this.subscription_id
    );
  }

  private updated(
    slot: number,
    whirlpool_pubkey: PublicKey,
    whirlpool_data: WhirlpoolData
  ) {
    const b58 = whirlpool_pubkey.toBase58();

    // filter callback with same sqrt_price
    if (this.sqrt_price_emitted.get(b58)?.eq(whirlpool_data.sqrtPrice)) return;

    this.sqrt_price_emitted.set(b58, whirlpool_data.sqrtPrice);
    return this.updateHelper(slot, whirlpool_pubkey, whirlpool_data);
  }

  private async updateHelper(
    slot: number,
    whirlpool_pubkey: PublicKey,
    whirlpool_data: WhirlpoolData
  ) {
    try {
      const commitment = "confirmed";
      const connection = new Connection(RPC_ENDPOINT_URL, commitment);
      const dummy_wallet = new Wallet(Keypair.generate());
      const ctx = WhirlpoolContext.from(
        connection,
        dummy_wallet,
        ORCA_WHIRLPOOL_PROGRAM_ID
      );
      const fetcher = ctx.fetcher;

      const token_a = await fulfillWithTimeLimit(
        2000,
        fetcher.getMintInfo(whirlpool_data!.tokenMintA, false)
      );
      if (token_a == null) {
        return false;
      }
      const token_b = await fulfillWithTimeLimit(
        2000,
        fetcher.getMintInfo(whirlpool_data!.tokenMintB, false)
      );
      if (token_b == null) {
        return false;
      }
      const price = PriceMath.sqrtPriceX64ToPrice(
        whirlpool_data.sqrtPrice,
        token_a!.decimals,
        token_b!.decimals
      ).toFixed(token_b!.decimals);

      const b58 = whirlpool_pubkey.toBase58();

      const client = buildWhirlpoolClient(ctx);
      const pool = await client.getPool(b58);
      // Getting TokenInfo from the pool
      const token_a_info = pool.getTokenVaultAInfo();
      const token_b_info = pool.getTokenVaultBInfo();

      //Converting Token supply to readable format
      const askSize = new Decimal(token_a_info.amount.toString()).div(
        10 ** token_a!.decimals
      );
      const bidSize = new Decimal(token_b_info.amount.toString()).div(
        10 ** token_b!.decimals
      );
      const tokens = this.whirlpoolSymbols.get(b58);
      if (tokens == undefined) {
        console.log("Address not found: ", b58);
        return false;
      }
      const state = {
        dex: "Whirlpool",
        tokenA: tokens[0],
        tokenB: tokens[1],
        slot: slot,
        bidSize: bidSize.toNumber(),
        askSize: askSize.toNumber(),
        askPrice: Number.parseFloat(price),
        bidPrice: Number.parseFloat(price),
        type: UPDATE_TYPE.CHANGE,
      };

      this.state.set(b58, state);
      return state;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  private async updateWhirlpool(
    keyed_account_info: KeyedAccountInfo,
    context: Context
  ) {
    const whirlpool_pubkey = keyed_account_info.accountId;
    const whirlpool_data = ParsableWhirlpool.parse(
      keyed_account_info.accountInfo.data
    );
    this.slots.set(keyed_account_info.accountId.toBase58(), context.slot);
    const result = await this.updated(
      context.slot,
      whirlpool_pubkey,
      whirlpool_data!
    );
    if (result) {
      this.consumer.processPriceUpdate(result);
    }
  }

  public async updateStates() {
    for (const key of this.whirlpoolSymbols.keys()) {
      try {
        const curSlot = await this.connection.getSlot();
        // check if certain time has passed since last update
        if (curSlot < this.slots.get(key)! + UPDATE_TIMER / 500) {
          console.log("sent an update recently for,", key);
          continue;
        }
        this.slots.set(key, curSlot);
        const info = await this.connection.getAccountInfo(new PublicKey(key));
        const whirlpool_data = ParsableWhirlpool.parse(info!.data);
        const commitment = "confirmed";
        const connection = new Connection(RPC_ENDPOINT_URL, commitment);
        const dummy_wallet = new Wallet(Keypair.generate());
        const ctx = WhirlpoolContext.from(
          connection,
          dummy_wallet,
          ORCA_WHIRLPOOL_PROGRAM_ID
        );
        const fetcher = ctx.fetcher;
        const token_a = await fulfillWithTimeLimit(
          2000,
          fetcher.getMintInfo(whirlpool_data!.tokenMintA, false)
        );
        if (token_a == null) {
          continue;
        }
        const token_b = await fulfillWithTimeLimit(
          2000,
          fetcher.getMintInfo(whirlpool_data!.tokenMintB, false)
        );
        if (token_b == null) {
          continue;
        }
        const price = PriceMath.sqrtPriceX64ToPrice(
          whirlpool_data!.sqrtPrice,
          token_a!.decimals,
          token_b!.decimals
        ).toFixed(token_b!.decimals);
        const client = buildWhirlpoolClient(ctx);
        const pool = await client.getPool(new PublicKey(key));
        // Getting TokenInfo from the pool
        const token_a_info = pool.getTokenVaultAInfo();
        const token_b_info = pool.getTokenVaultBInfo();

        //Converting Token supply to readable format
        const askSize = new Decimal(token_a_info.amount.toString()).div(
          10 ** token_a!.decimals
        );
        const bidSize = new Decimal(token_b_info.amount.toString()).div(
          10 ** token_b!.decimals
        );
        const tokens = this.whirlpoolSymbols.get(key)!;
        const state = {
          dex: "Whirlpool",
          tokenA: tokens[0],
          tokenB: tokens[1],
          slot: this.slots.get(key)!,
          bidSize: bidSize.toNumber(),
          askSize: askSize.toNumber(),
          askPrice: Number.parseFloat(price),
          bidPrice: Number.parseFloat(price),
          type: UPDATE_TYPE.UPDATE,
        };
        this.state.set(key, state);
      } catch (e) {
        console.log(e);
        continue;
      }
    }
  }
  public getMarkets(): string[] {
    const markets: string[] = [];
    for (const pair of this.whirlpoolSymbols.values()) {
      markets.push(pair[0] + "_" + pair[1]);
    }
    return markets;
  }
  public getState(): PriceUpdate[] {
    const stateArray: PriceUpdate[] = [];
    for (const state of this.state.values()) {
      stateArray.push(state);
    }
    return stateArray;
  }
}
