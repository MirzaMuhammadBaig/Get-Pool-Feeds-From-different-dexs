import Decimal from "decimal.js";
import { OrcaPoolToken, OrcaToken, Percentage } from "@orca-so/sdk";
import { Keypair } from "@solana/web3.js";
import { u64 } from "@solana/spl-token";

export const RPC_ENDPOINT_URL =
  process.env.RPC_URL ||
  "https://lively-young-pond.solana-mainnet.discover.quiknode.pro/45744cef8381e6476f2016fc719c09b79e5204d6/";
export const REDPANDA_URL = process.env.REDPANDA_URL || "72.52.83.237:9092";
export const WEBSOCKET_PORT = 12000;
export const SERVER_PORT = 15000;
export const UPDATE_TIMER = 300000;

export enum UPDATE_TYPE {
  CHANGE,
  UPDATE,
}

export type QuoteParams = {
  inputToken: OrcaToken;
  outputToken: OrcaToken;
  inputTokenCount: u64;
  outputTokenCount: u64;
  feeStructure: { traderFee: Percentage; ownerFee: Percentage };
  slippageTolerance: Percentage;
  lamportsPerSignature: number;
  amp: u64;
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

export interface OrcaPoolMonitorCallback {
  (priceUpdate: PriceUpdate): Promise<void>;
}

export interface PriceFeedConsumer {
  init(): Promise<void>;
  processPriceUpdate(priceUpdate: PriceUpdate): Promise<void>;
}

export type PoolToken = {
  poolToken: OrcaPoolToken;
  tokenName: string;
  tokenAmount: Decimal;
  updateSlot: number;
  amountEmitted: Decimal;
  subscriptionID: number;
};

export const initPoolToken = (options?: Partial<PoolToken>): PoolToken => {
  const defaults = {
    tokenName: "",
    poolToken: {
      tag: "",
      name: "",
      scale: -1,
      addr: new Keypair().publicKey,
      mint: new Keypair().publicKey,
    },
    tokenAmount: new Decimal(0),
    amountEmitted: new Decimal(0),
    updateSlot: -1,
    subscriptionID: -1,
  };

  return {
    ...defaults,
    ...options,
  };
};
