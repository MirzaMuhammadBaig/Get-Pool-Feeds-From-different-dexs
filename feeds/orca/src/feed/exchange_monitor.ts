import { PriceFeedConsumer, PriceUpdate, UPDATE_TIMER } from "../utils";
import { Connection } from "@solana/web3.js";
import { OrcaPoolMonitor } from "./pool_monitor";
import { OrcaPoolConfig, getOrca, Network, Orca } from "@orca-so/sdk";
import {
  msolSolPool,
  stsolSolPool,
  wustUsdcPool,
  scnsolSolPool,
  usdcUsdtPool,
} from "@orca-so/sdk/dist/constants";
import { OrcaPoolParams } from "@orca-so/sdk/dist/model/orca/pool/pool-types";

export class OrcaExchangeMonitor {
  private orca: Orca;
  private connection: Connection;
  private feedConsumer: PriceFeedConsumer;
  private tokensToKeep?: Set<string>;
  private tokensToFilter?: Set<string>;
  private tokenPairAddresses: Map<string, string>;
  private monitors: Array<OrcaPoolMonitor>;

  constructor(
    rpcURL: string,
    feedConsumer: PriceFeedConsumer,
    slot: number,
    tokensToKeep?: Array<string>,
    tokensToFilter?: Array<string>
  ) {
    if (tokensToKeep && tokensToFilter) {
      throw new Error(
        "tokensToKeep and tokensToFilter cannot both be specified at the same time!"
      );
    }
    this.feedConsumer = feedConsumer;
    this.tokensToKeep = new Set(tokensToKeep);
    this.tokensToFilter = new Set(tokensToFilter);
    this.tokenPairAddresses = this.getTokenPairAddresses();
    this.connection = new Connection(rpcURL, "confirmed");
    this.orca = getOrca(this.connection, Network.MAINNET);
    this.monitors = new Array<OrcaPoolMonitor>();
    for (const [tokenPair, tokenAddress] of this.tokenPairAddresses.entries()) {
      var poolConfig: OrcaPoolParams | undefined = undefined;
      switch (tokenPair) {
        case "wUST_USDC":
          poolConfig = wustUsdcPool;
          break;
        case "mSOL_SOL":
          poolConfig = msolSolPool;
          break;
        case "stSOL_SOL":
          poolConfig = stsolSolPool;
          break;
        case "scnSOL_SOL":
          poolConfig = scnsolSolPool;
          break;
        case "USDC_USDT":
          poolConfig = usdcUsdtPool;
          break;
      }
      this.monitors.push(
        new OrcaPoolMonitor(
          this.connection,
          this.orca.getPool(tokenAddress as OrcaPoolConfig),
          tokenPair,
          slot,
          this.feedConsumer.processPriceUpdate.bind(this.feedConsumer),
          poolConfig
        )
      );
    }
  }

  public startMonitoring() {
    this.monitors.forEach((monitor) => {
      monitor.startMonitoring();
    });
    setInterval(() => {
      this.updateStates();
    }, UPDATE_TIMER);
  }

  private updateStates() {
    this.monitors.forEach((monitor) => {
      monitor.updateState();
    });
  }

  private getTokenPairAddresses(): Map<string, string> {
    function enumKeys<O extends object, K extends keyof O = keyof O>(
      obj: O
    ): K[] {
      return Object.keys(obj).filter((k) => Number.isNaN(+k)) as K[];
    }
    const tokenPairAddresses: Map<string, string> = new Map();
    for (const tokenPairName of enumKeys(OrcaPoolConfig)) {
      if (
        (!this.tokensToFilter && !this.tokensToKeep) ||
        (this.tokensToFilter && !this.tokensToFilter.has(tokenPairName)) ||
        (this.tokensToKeep && this.tokensToKeep.has(tokenPairName))
      ) {
        if (tokenPairName.includes("ONESOL")) {
          tokenPairAddresses.set(
            tokenPairName.replace("ONESOL", "1SOL"),
            OrcaPoolConfig[tokenPairName]
          );
        } else {
          tokenPairAddresses.set(tokenPairName, OrcaPoolConfig[tokenPairName]);
        }
      }
    }
    return tokenPairAddresses;
  }

  // To get market symbols
  public getMarkets(): string[] {
    const markets: string[] = [];
    this.monitors.forEach((monitor) => {
      markets.push(monitor.pair);
    });
    return markets;
  }

  // To get current state of all the pools
  // This function won't return an update if pool has been updated in last 600 slots (last 5 minutes)

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
