import { Connection, PublicKey } from "@solana/web3.js";
import {
  PriceFeedConsumer,
  PriceUpdate,
  UPDATE_TIMER,
  initializeMarkets,
} from "../utils";
import { SaberPoolMonitor } from "./pool_monitor";

/**
 * Monitor the whole Saber Exchange
 */
export class SaberExchangeMonitor {
  private connection: Connection;
  private consumer: PriceFeedConsumer;
  private monitors: Array<SaberPoolMonitor>;

  constructor(connection: Connection, consumer: PriceFeedConsumer) {
    this.connection = connection;
    this.consumer = consumer;
    this.monitors = new Array<SaberPoolMonitor>();
  }

  public async init() {
    const swapData = await initializeMarkets(this.connection);
    for (let pool of swapData) {
      this.monitors.push(
        new SaberPoolMonitor(
          this.connection,
          pool[1].poolName,
          pool[1].poolKey,
          pool[1].stableSwap,
          pool[1].exchange,
          this.consumer
        )
      );
    }
  }

  public async startMonitoring() {
    this.monitors.forEach((monitor) => {
      monitor.startMonitoring();
    });
    setInterval(() => {
      this.updateStates();
    }, UPDATE_TIMER);
  }

  private async updateStates() {
    this.monitors.forEach((monitor) => {
      try {
        monitor.updateState();
      } catch (e) {
        return;
      }
    });
  }
  public getMarkets() {
    const markets: string[] = [];
    this.monitors.forEach((monitor) => {
      markets.push(monitor.poolName);
    });
    return markets;
  }
  public getState() {
    const stateArray: PriceUpdate[] = [];
    this.monitors.forEach((monitor) => {
      if (monitor.state.slot) {
        stateArray.push(monitor.state);
      }
    });
    return stateArray;
  }
}
