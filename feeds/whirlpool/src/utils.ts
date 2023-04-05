import { BN } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import fetch from "cross-fetch";
import { exit } from "process";

// constants
export const RPC_ENDPOINT_URL =
  process.env.RPC_URL ||
  "https://lively-young-pond.solana-mainnet.discover.quiknode.pro/45744cef8381e6476f2016fc719c09b79e5204d6/";
export const REDPANDA_URL = process.env.REDPANDA_URL || "72.52.83.237:9092";
export const WHIRLPOOL_API =
  "https://api.mainnet.orca.so/v1/whirlpool/list?whitelisted=true";

export const WEBSOCKET_PORT = 12003;
export const SERVER_PORT = 15003;
export const UPDATE_TIMER = 300000;

const MIN_TVL = 5000;
export enum UPDATE_TYPE {
  CHANGE,
  UPDATE,
}
export declare type WhirlpoolRewardInfoData = {
  mint: PublicKey;
  vault: PublicKey;
  authority: PublicKey;
  emissionsPerSecondX64: BN;
  growthGlobalX64: BN;
};

export declare type WhirlpoolData = {
  whirlpoolsConfig: PublicKey;
  whirlpoolBump: number[];
  feeRate: number;
  protocolFeeRate: number;
  liquidity: BN;
  sqrtPrice: BN;
  tickCurrentIndex: number;
  protocolFeeOwedA: BN;
  protocolFeeOwedB: BN;
  tokenMintA: PublicKey;
  tokenVaultA: PublicKey;
  feeGrowthGlobalA: BN;
  tokenMintB: PublicKey;
  tokenVaultB: PublicKey;
  feeGrowthGlobalB: BN;
  rewardLastUpdatedTimestamp: BN;
  rewardInfos: WhirlpoolRewardInfoData[];
  tickSpacing: number;
};

export interface PriceUpdate {
  dex: string;
  tokenA: string;
  tokenB: string;
  slot: number;
  bidSize: number;
  askSize: number;
  askPrice: number;
  bidPrice: number;
  type: UPDATE_TYPE;
}

export interface PriceFeedConsumer {
  init(): Promise<void>;
  processPriceUpdate(priceUpdate: PriceUpdate): Promise<void>;
}

export async function fulfillWithTimeLimit(timeLimit: number, task: any) {
  let timeout;
  const timeoutPromise = new Promise((resolve, reject) => {
    timeout = setTimeout(() => {
      resolve(null);
    }, timeLimit);
  });
  const response = await Promise.race([task, timeoutPromise]);
  if (timeout) {
    //the code works without this but let's be safe and clean up the timeout
    clearTimeout(timeout);
  }
  return response;
}

export async function initializeMarkets(): Promise<
  Map<string, [string, string]>
> {
  try {
    const volumes: Map<string, [string, number]> = new Map();
    const whirlpoolSymbols: Map<string, [string, string]> = new Map();
    const marketData = await (await fetch(WHIRLPOOL_API)).json();
    for (const market of marketData["whirlpools"]) {
      if (market["tvl"] < MIN_TVL) {
        continue;
      }
      const volSymbol: string =
        market["tokenA"]["symbol"] + "-" + market["tokenB"]["symbol"];
      if (
        volumes.get(volSymbol) &&
        volumes.get(volSymbol)![1] >= market["tvl"]
      ) {
        continue;
      } else {
        volumes.set(volSymbol, [market["address"], market["tvl"]]);
      }
    }
    for (const key of volumes) {
      const tokens: string[] = key[0].split("-");
      whirlpoolSymbols.set(key[1][0], [tokens[0], tokens[1]]);
    }
    return whirlpoolSymbols;
  } catch (e) {
    console.log(e);
    exit(1);
  }
}
