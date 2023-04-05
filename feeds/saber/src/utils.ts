import { BN } from "@project-serum/anchor";
import {
  Fees,
  IExchange,
  loadExchangeInfo,
  StableSwap,
  StableSwapConfig,
  StableSwapState,
  SwapTokenInfo,
} from "@saberhq/stableswap-sdk";
import { Percent, Token, TOKEN_PROGRAM_ID, u64 } from "@saberhq/token-utils";
import { Connection, PublicKey } from "@solana/web3.js";
import fetch from "cross-fetch";

export const RPC_ENDPOINT_URL =
  process.env.RPC_URL ||
  "https://lively-young-pond.solana-mainnet.discover.quiknode.pro/45744cef8381e6476f2016fc719c09b79e5204d6/";
export const REDPANDA_URL = process.env.REDPANDA_URL || "72.52.83.237:9092";
export const WEBSOCKET_PORT = 12002;
export const SERVER_PORT = 15002;
export const UPDATE_TIMER = 300000;
export const SABER_API =
  "https://registry.saber.so/data/pools-info.mainnet.json";

const BAD_TOKENS = ["agEUR", "acEUR", "pUSDT", "pUSDC", "TRYB"];

export enum UPDATE_TYPE {
  CHANGE,
  UPDATE,
}

export type MintInfo = {
  mintAuthority: null | PublicKey;
  supply: u64;
  decimals: number;
  isInitialized: boolean;
  freezeAuthority: null | PublicKey;
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

export interface ExtensionsRaw {
  coingeckoId?: string;
  source?: string;
  currency?: string;
  sourceUrl?: string;
  website?: string;
  serumV3Usdt?: string;
  assetContract?: string;
  underlyingTokens?: string[];
}

export interface TokenRaw {
  name: string;
  symbol: string;
  logoURI?: string;
  decimals: number;
  address: string;
  chainId: number;
  tags?: string[];
  extensions: ExtensionsRaw;
}

export interface LPExtensions {
  website: string;
  underlyingTokens: string[];
  source: string;
}

export interface LpTokenRaw {
  symbol: string;
  name: string;
  logoURI: string;
  decimals: number;
  address: string;
  chainId: number;
  tags: string[];
  extensions: LPExtensions;
}

export interface ConfigRaw {
  swapAccount: string;
  authority: string;
  swapProgramID: string;
  tokenProgramID: string;
}

export interface StateTokenRaw {
  adminFeeAccount: string;
  mint: string;
  reserve: string;
}

export interface FeeDataRaw {
  formatted: string;
  numerator: string;
  denominator: string;
}

export interface FeesRaw {
  trade: FeeDataRaw;
  adminTrade: FeeDataRaw;
  withdraw: FeeDataRaw;
  adminWithdraw: FeeDataRaw;
}

export interface StateRaw {
  isInitialized: boolean;
  isPaused: boolean;
  nonce: number;
  futureAdminDeadline: number;
  futureAdminAccount: string;
  poolTokenMint: string;
  adminAccount: string;
  tokenA: StateTokenRaw;
  tokenB: StateTokenRaw;
  initialAmpFactor: string;
  targetAmpFactor: string;
  startRampTimestamp: number;
  stopRampTimestamp: number;
  fees: FeesRaw;
}

export interface SwapInfoRaw {
  config: ConfigRaw;
  state: StateRaw;
}

export type PoolMonitorParams = {
  poolName: string;
  poolKey: string;
  reserveB: string;
  tokenASymbol: string;
  tokenBSymbol: string;
  tokenADecimals: number;
  tokenBDecimals: number;
};
export interface ExchangeDataRaw {
  programID: string;
  swapAccount: string;
  lpToken: LpTokenRaw;
  tokens: TokenRaw[];
}
export interface SaberData {
  poolName: string;
  poolKey: PublicKey;
  stableSwap: StableSwap;
  exchange: IExchange;
}

/**
 * Local helper function to process the string values and return corresponding public keys
 * @param rawSwapTokenInfo
 * @returns
 */
function toSwapTokenInfo(rawSwapTokenInfo: any): SwapTokenInfo {
  return {
    adminFeeAccount: new PublicKey(rawSwapTokenInfo.adminFeeAccount),
    mint: new PublicKey(rawSwapTokenInfo.mint),
    reserve: new PublicKey(rawSwapTokenInfo.reserve),
  };
}

/**
 * Local helper function to parse raw fees data and return Fees Object
 * @param rawFees
 * @returns
 */
function toFees(rawFees: FeesRaw): Fees {
  return {
    trade: new Percent(rawFees.trade.numerator, rawFees.trade.denominator),
    withdraw: new Percent(
      rawFees.withdraw.numerator,
      rawFees.withdraw.denominator
    ),
    adminTrade: new Percent(
      rawFees.adminTrade.numerator,
      rawFees.adminTrade.denominator
    ),
    adminWithdraw: new Percent(
      rawFees.adminWithdraw.numerator,
      rawFees.adminWithdraw.denominator
    ),
  };
}

/**
 * contains swap config and swap state in raw form (strings) and returns equivalent StableSwapObject
 * @param swapData
 * @returns StableSwap Object
 */
export function getStableSwapCustom(swapData: SwapInfoRaw): StableSwap {
  var newConfig: StableSwapConfig = {
    authority: new PublicKey(swapData.config.authority),
    swapAccount: new PublicKey(swapData.config.swapAccount),
    swapProgramID: new PublicKey(swapData.config.swapProgramID),
    tokenProgramID: TOKEN_PROGRAM_ID,
  };
  var newState: StableSwapState = {
    isInitialized: swapData.state.isInitialized,
    isPaused: swapData.state.isPaused,
    nonce: swapData.state.nonce,
    poolTokenMint: new PublicKey(swapData.state.poolTokenMint),
    adminAccount: new PublicKey(swapData.state.adminAccount),
    tokenA: toSwapTokenInfo(swapData.state.tokenA),
    tokenB: toSwapTokenInfo(swapData.state.tokenB),
    initialAmpFactor: new BN(
      Number.parseInt(swapData.state.initialAmpFactor, 16)
    ),
    targetAmpFactor: new BN(
      Number.parseInt(swapData.state.targetAmpFactor, 16)
    ),
    startRampTimestamp: swapData.state.startRampTimestamp,
    stopRampTimestamp: swapData.state.stopRampTimestamp,
    futureAdminDeadline: swapData.state.futureAdminDeadline,
    futureAdminAccount: new PublicKey(swapData.state.futureAdminAccount),
    fees: toFees(swapData.state.fees),
  };
  return new StableSwap(newConfig, newState);
}

/**
 * Receives IExchange data in raw form and returns equivalent IExchange Objct
 * @param exchangeData
 * @returns IExchange
 */
export function getExchangeCustom(exchangeData: ExchangeDataRaw): IExchange {
  return {
    programID: new PublicKey(exchangeData.programID),
    swapAccount: new PublicKey(exchangeData.swapAccount),
    lpToken: new Token(exchangeData.lpToken),
    tokens: [
      new Token(exchangeData.tokens[0]),
      new Token(exchangeData.tokens[1]),
    ],
  };
}

export async function initializeMarkets(
  connection: Connection
): Promise<Map<string, SaberData>> {
  const saberMap: Map<string, SaberData> = new Map();
  const saberData = await (await fetch(SABER_API)).json();
  for (const pool of saberData["pools"]) {
    const poolSymbols = pool.name.split("-");
    const poolName = poolSymbols[0] + "_" + poolSymbols[1];

    // filter pools with isolated tokens
    if (BAD_TOKENS.some((r) => poolSymbols.includes(r))) {
      console.log("BAD TOKEN FOUND");
      console.log(poolSymbols);

      continue;
    }
    const exchange = getExchangeCustom({
      programID: pool.swap.config.swapProgramID,
      swapAccount: pool.swap.config.swapAccount,
      lpToken: pool.lpToken,
      tokens: pool.tokens,
    });
    const stableSwap = getStableSwapCustom(pool.swap);

    const exchangeInfo = await loadExchangeInfo(
      connection,
      exchange,
      stableSwap
    );

    // liquidity filter
    if (
      exchangeInfo.reserves[0].amount.asNumber +
        exchangeInfo.reserves[1].amount.asNumber <
      5000
    ) {
      continue;
    }

    const poolKey = new PublicKey(pool.swap.state.tokenA.reserve);
    saberMap.set(pool["name"], {
      poolName,
      poolKey,
      stableSwap,
      exchange,
    });
  }
  return saberMap;
}
