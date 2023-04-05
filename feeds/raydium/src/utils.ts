import { Connection, PublicKey, AccountInfo } from "@solana/web3.js";
import { OpenOrders } from "@project-serum/serum";
import { LIQUIDITY_STATE_LAYOUT_V4 } from "@raydium-io/raydium-sdk";
import { Decimal } from "decimal.js";
import fetch from "cross-fetch";
import { exit } from "process";

export const RPC_ENDPOINT_URL =
  process.env.RPC_URL ||
  "https://lively-young-pond.solana-mainnet.discover.quiknode.pro/45744cef8381e6476f2016fc719c09b79e5204d6/";
export const REDPANDA_URL = process.env.REDPANDA_URL || "72.52.83.237:9092";

export const WEBSOCKET_PORT = 12001;

export const SERVER_PORT = 15001;

export const RAYDIUM_API = "https://api.raydium.io/pairs";

export const UPDATE_TIMER = 300000;
export enum UPDATE_TYPE {
  CHANGE,
  UPDATE,
}

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

// @ts-nocheck
export async function decodeAccountData(
  accountInfo: AccountInfo<Buffer>,
  connection: Connection,
  dexProgramId: PublicKey
) {
  const state = LIQUIDITY_STATE_LAYOUT_V4.decode(accountInfo.data);

  try {
    const baseTokenAmount = await connection.getTokenAccountBalance(
      state.baseVault
    );
    const quoteTokenAmount = await connection.getTokenAccountBalance(
      state.quoteVault
    );
    const openOrders = await OpenOrders.load(
      connection,
      state.openOrders,
      dexProgramId
    );

    const baseDecimal = 10 ** state.baseDecimal.toNumber();
    const quoteDecimal = 10 ** state.quoteDecimal.toNumber();

    const openOrdersTotalBase =
      openOrders.baseTokenTotal.toNumber() / baseDecimal;
    const openOrdersTotalQuote =
      openOrders.quoteTokenTotal.toNumber() / quoteDecimal;

    const basePnl = state.baseNeedTakePnl.toNumber() / baseDecimal;
    const quotePnl = state.quoteNeedTakePnl.toNumber() / quoteDecimal;
    // @ts-ignore
    const base =
      baseTokenAmount.value?.uiAmount! + openOrdersTotalBase - basePnl;

    // @ts-ignore
    const quote =
      quoteTokenAmount.value?.uiAmount! + openOrdersTotalQuote - quotePnl;

    const priceInQuote = new Decimal(quote).div(base).toNumber();

    return {
      base,
      quote,
      priceInQuote,
    };
  } catch (err) {
    return null;
  }
}

export async function initializeMarkets(): Promise<
  Map<string, [string, string]>
> {
  try {
    const raydiumSymbols: Map<string, [string, string]> = new Map();
    const raydiumData = await (await fetch(RAYDIUM_API)).json();
    var i = 0;
    for (const marketData of raydiumData) {
      if (
        marketData["volume_24h"] > 1000 &&
        marketData["volume_7d"] + marketData["volume_7d_quote"] > 10000
      ) {
        if (
          marketData["name"] === "USDT-USDC" &&
          marketData["volume_24h"] < 50000
        ) {
          continue;
        }
        const tokens = marketData["name"].split("-");
        i++;
        raydiumSymbols.set(marketData["amm_id"], tokens);
      }
    }
    return raydiumSymbols;
  } catch (e) {
    console.log(e);
    console.log("CANNOT FIND MARKETS! API NOT RESPONDING");
    exit(1);
  }
}
