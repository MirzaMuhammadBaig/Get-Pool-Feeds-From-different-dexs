import { Connection, Context, PublicKey, AccountInfo } from "@solana/web3.js";
import {
  decodeAccountData,
  UPDATE_TIMER,
  PriceFeedConsumer,
  PriceUpdate,
  UPDATE_TYPE,
} from "../utils";

export class RaydiumPoolMonitor {
  // public attr
  public tokens: [string, string];
  public state: PriceUpdate;

  // private attr
  private connection: Connection;
  private poolKey: PublicKey;
  private dexProgramId: PublicKey;
  private price: number;
  private slot: number;
  private consumer: PriceFeedConsumer;
  constructor(
    connection: Connection,
    poolKey: PublicKey,
    dexProgramId: PublicKey,
    tokens: [string, string],
    slot: number,
    consumer: PriceFeedConsumer
  ) {
    this.connection = connection;
    this.poolKey = poolKey;
    this.dexProgramId = dexProgramId;
    this.tokens = tokens;
    this.price = 0;
    this.slot = slot;
    this.consumer = consumer;
    this.state = {
      dex: "Raydium",
      tokenA: tokens[0],
      tokenB: tokens[1],
      slot,
      bidSize: 0,
      bidPrice: 0,
      askSize: 0,
      askPrice: 0,
      type: UPDATE_TYPE.UPDATE,
    };
  }

  public async startMonitoring() {
    this.connection.onAccountChange(this.poolKey, this.updatePool.bind(this));
  }

  /**
   * Sends update to consumer when onAccountChange event is triggered
   * @param accountInfo updated account's info
   * @param context  current solana context
   */
  public async updatePool(accountInfo: AccountInfo<Buffer>, context: Context) {
    this.slot = context.slot;
    const info = await decodeAccountData(
      accountInfo,
      this.connection,
      this.dexProgramId
    );

    if (info && this.price != info.priceInQuote) {
      this.price = info.priceInQuote;
      this.state = {
        dex: "Raydium",
        tokenA: this.tokens[0],
        tokenB: this.tokens[1],
        slot: this.slot,
        bidSize: info.quote,
        askSize: info.base,
        askPrice: this.price,
        bidPrice: this.price,
        type: UPDATE_TYPE.CHANGE,
      };
      this.consumer.processPriceUpdate(this.state);
    }
  }

  /**
   * get scheduled update for the raydium pool
   */
  public async updateState() {
    try {
      // Check if certain time has passed since last update
      const curSlot = await this.connection.getSlot();
      if (this.slot + UPDATE_TIMER / 500 > curSlot) {
        console.log("State updated recently");
        return;
      }
      this.slot = curSlot;

      const accountInfo = await this.connection.getAccountInfo(this.poolKey);

      if (accountInfo) {
        const info = await decodeAccountData(
          accountInfo!,
          this.connection,
          this.dexProgramId
        );
        if (info) {
          this.price = info.priceInQuote;

          this.state = {
            dex: "Raydium",
            tokenA: this.tokens[0],
            tokenB: this.tokens[1],
            slot: this.slot,
            bidSize: info.quote,
            askSize: info.base,
            askPrice: this.price,
            bidPrice: this.price,
            type: UPDATE_TYPE.UPDATE,
          };
        }
      }
    } catch (e) {
      return;
    }
  }
}
