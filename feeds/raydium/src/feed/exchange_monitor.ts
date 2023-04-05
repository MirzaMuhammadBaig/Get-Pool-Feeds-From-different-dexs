import { Connection, PublicKey } from "@solana/web3.js";
import { RaydiumPoolMonitor } from "../feed/pool_monitor";
import { PriceFeedConsumer, PriceUpdate, UPDATE_TIMER } from "../utils";

export class RaydiumExchangeMonitor {
  private connection: Connection;
  private dexProgramId: PublicKey;
  private consumer: PriceFeedConsumer;
  private monitors: Array<RaydiumPoolMonitor>;
  private raydiumSymbols: Map<string, [string, string]>;
  constructor(
    connection: Connection,
    dexProgramId: PublicKey,
    consumer: PriceFeedConsumer
  ) {
    this.monitors = new Array<RaydiumPoolMonitor>();
    this.connection = connection;
    this.dexProgramId = dexProgramId;
    this.consumer = consumer;
    this.raydiumSymbols = new Map();
  }
  public init(raydiumSymbols: Map<string, [string, string]>, slot: number) {
    this.raydiumSymbols = raydiumSymbols;
    // initialize pool monitor objects
    for (const key of this.raydiumSymbols.keys()) {
      const monitor = new RaydiumPoolMonitor(
        this.connection,
        new PublicKey(key),
        this.dexProgramId,
        this.raydiumSymbols.get(key)!,
        slot,
        this.consumer
      );
      this.monitors.push(monitor);
    }
  }

  /**
   * Monitors all raydium pools/pairs. Sends update on account change
   */
  public startMonitoring() {
    this.monitors.forEach((monitor) => {
      monitor.startMonitoring();
    });
    setInterval(() => {
      this.updateStates();
    }, UPDATE_TIMER);
  }

  /**
   * Update pool states after a fixed interval
   */
  private updateStates() {
    this.monitors.forEach(async (monitor) => {
      monitor.updateState();
    });
  }

  public getMarkets(): string[] {
    const markets: string[] = [];
    this.monitors.forEach((monitor) => {
      markets.push(monitor.tokens[0] + "_" + monitor.tokens[1]);
    });
    return markets;
  }

  // To get current state of all the pools
  // This functiom won't return an update if pool has been updated in last 600 slots (last 5 minutes)

  public getState() {
    const stateArray: PriceUpdate[] = [];
    for (const monitor of this.monitors) {
      const state = monitor.state;
      if (state.askPrice) {
        stateArray.push(state);
      }
    }
    return stateArray;
  }
}
