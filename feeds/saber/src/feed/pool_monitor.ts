import {
  calculateVirtualPrice,
  IExchange,
  loadExchangeInfo,
  StableSwap,
} from "@saberhq/stableswap-sdk";
import { AccountInfo, Connection, Context, PublicKey } from "@solana/web3.js";
import {
  UPDATE_TIMER,
  PriceFeedConsumer,
  PriceUpdate,
  UPDATE_TYPE,
} from "../utils";

export class SaberPoolMonitor {
  public poolName: string;
  public state: PriceUpdate;

  private connection: Connection;
  private poolKey: PublicKey;
  private price: number;
  private slot: number;
  private consumer: PriceFeedConsumer;
  private stableSwap: StableSwap;
  private exchange: IExchange;

  /**
   *
   * @param connection Solana Connection
   * @param poolName  Pool Name to get the Token Icons
   * @param poolKey  TokenA reserve account address
   * @param stableSwap StableSwap object for fetching exchange info
   * @param exchange Exchange object for fetching the exchange info
   * @param consumer RedPanda Consumer
   */
  constructor(
    connection: Connection,
    poolName: string,
    poolKey: PublicKey,
    stableSwap: StableSwap,
    exchange: IExchange,
    consumer: PriceFeedConsumer
  ) {
    this.connection = connection;
    this.poolKey = poolKey;
    this.poolName = poolName;
    this.consumer = consumer;
    this.stableSwap = stableSwap;
    this.exchange = exchange;
    this.slot = 0;
    this.price = 0;
    this.state = {
      dex: "Saber",
      tokenA: poolName,
      tokenB: poolName,
      slot: 0,
      bidSize: 0,
      bidPrice: 0,
      askSize: 0,
      askPrice: 0,
      type: UPDATE_TYPE.UPDATE,
    };
  }

  /**
   * listens to the changes in reserve accounts and calls the update function
   */
  public async startMonitoring() {
    this.connection.onAccountChange(this.poolKey, this.updatePool.bind(this));
  }
  /**
   *
   * @param accountInfo updated account's data
   * @param context current context
   * @returns nothing. sends update to the redpanda consumer
   */
  private async updatePool(accountInfo: AccountInfo<Buffer>, context: Context) {
    try {
      this.slot = context.slot;
      const exchangeInfo = await loadExchangeInfo(
        this.connection,
        this.exchange,
        this.stableSwap
      );
      const newPrice = Number.parseFloat(
        calculateVirtualPrice(exchangeInfo)!.toFixed(6)
      );
      if (this.price === newPrice) {
        return;
      } else {
        this.price = newPrice;
      }
      var symbols = this.poolName.split("_");
      this.state = {
        dex: "Saber",
        tokenA: symbols[0],
        tokenB: symbols[1],
        slot: this.slot,
        bidSize: exchangeInfo.reserves[0].amount.asNumber,
        askSize: exchangeInfo.reserves[1].amount.asNumber,
        askPrice: this.price,
        bidPrice: this.price,
        type: UPDATE_TYPE.CHANGE,
      };
      this.consumer.processPriceUpdate(this.state);
    } catch (e) {
      console.log(e);
    }
  }

  public async updateState() {
    try {
      const curSlot = await this.connection.getSlot();

      // Check if a certain time has passed since last update
      if (this.slot + UPDATE_TIMER / 500 > curSlot) {
        console.log("Updated recently");
        return;
      }
      this.slot = curSlot;
      const exchangeInfo = await loadExchangeInfo(
        this.connection,
        this.exchange,
        this.stableSwap
      );
      const newPrice = Number.parseFloat(
        calculateVirtualPrice(exchangeInfo)!.toFixed(6)
      );
      var symbols = this.poolName.split("_");
      this.state = {
        dex: "Saber",
        tokenA: symbols[0],
        tokenB: symbols[1],
        slot: this.slot,
        bidSize: exchangeInfo.reserves[0].amount.asNumber,
        askSize: exchangeInfo.reserves[1].amount.asNumber,
        askPrice: newPrice,
        bidPrice: newPrice,
        type: UPDATE_TYPE.UPDATE,
      };
    } catch (e) {
      console.log(e);
    }
  }
}
