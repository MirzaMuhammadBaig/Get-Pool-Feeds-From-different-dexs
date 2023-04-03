import fetch from "node-fetch";

const endpoint = "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2";

const query = `
query {
   _meta {
    block {
      hash
      number
      timestamp
    }
    deployment
    hasIndexingErrors
  }
  bundles {
    ethPrice
    id
  }
  burns {
    amount0
    amount1
    amountUSD
    feeLiquidity
    feeTo
    id
    liquidity
    logIndex
    needsComplete
    sender
    timestamp
    to
    pair {
      token0 {
        name
        symbol
      }
      token1 {
        name
        symbol
      }
    }
  }
  liquidityPositionSnapshots {
    id
    block
    liquidityTokenBalance
    liquidityTokenTotalSupply
    reserve0
    reserve1
    reserveUSD
    timestamp
    token0PriceUSD
    token1PriceUSD
    liquidityPosition {
      id
      liquidityTokenBalance
    }
    pair
  }
  liquidityPositions {
    id
    liquidityTokenBalance
  }
  mints {
    amount0
    amount1
    amountUSD
    feeLiquidity
    feeTo
    id
    liquidity
    logIndex
    sender
    timestamp
    to
  }
  pairDayDatas {
    dailyTxns
    dailyVolumeToken0
    dailyVolumeToken1
    dailyVolumeUSD
    date
    id
    pairAddress
    reserve0
    reserve1
    reserveUSD
    totalSupply
    token0 {
      decimals
      derivedETH
      id
      name
      symbol
      totalLiquidity
      totalSupply
      tradeVolume
      tradeVolumeUSD
      untrackedVolumeUSD
      txCount
    }
    token1 {
      decimals
      derivedETH
      id
      name
      symbol
      totalLiquidity
      totalSupply
      tradeVolume
      tradeVolumeUSD
      txCount
      untrackedVolumeUSD
    }
  }
  pairHourDatas {
    hourStartUnix
    hourlyTxns
    hourlyVolumeToken0
    hourlyVolumeToken1
    hourlyVolumeUSD
    id
    reserve0
    reserve1
    reserveUSD
  }
  pairs {
    createdAtBlockNumber
    createdAtTimestamp
    id
    liquidityProviderCount
    reserve0
    reserve1
    reserveETH
    reserveUSD
    token0Price
    token1Price
    totalSupply
    trackedReserveETH
    txCount
    untrackedVolumeUSD
    volumeToken0
    volumeToken1
    volumeUSD
    token0 {
      decimals
      derivedETH
      id
      mostLiquidPairs {
        dailyTxns
        dailyVolumeToken0
        dailyVolumeToken1
        dailyVolumeUSD
        date
        id
        pairAddress
        reserve0
        reserve1
        reserveUSD
        totalSupply
      }
      name
      symbol
      totalLiquidity
      totalSupply
      tradeVolume
      tradeVolumeUSD
      txCount
      untrackedVolumeUSD
    }
    token1 {
      decimals
      derivedETH
      id
      mostLiquidPairs {
        dailyTxns
        dailyVolumeToken0
        dailyVolumeToken1
        dailyVolumeUSD
        date
        id
        pairAddress
        reserve0
        reserve1
        reserveUSD
        totalSupply
      }
      name
      symbol
      totalLiquidity
      totalSupply
      tradeVolume
      tradeVolumeUSD
      txCount
      untrackedVolumeUSD
    }
  }
  swaps {
    amount0In
    amount0Out
    amount1In
    amount1Out
    amountUSD
    id
    logIndex
    sender
    timestamp
    to
    pair {
      token0 {
        symbol
      }
      token1 {
        symbol
      }
    }
  }
  tokenDayDatas {
    dailyTxns
    dailyVolumeETH
    dailyVolumeToken
    dailyVolumeUSD
    date
    id
    maxStored
    priceUSD
    totalLiquidityETH
    totalLiquidityToken
    totalLiquidityUSD
    mostLiquidPairs {
      dailyTxns
      dailyVolumeToken0
      dailyVolumeToken1
      dailyVolumeUSD
      date
      id
      pairAddress
      reserve0
      reserve1
      reserveUSD
      totalSupply
    }
    token {
      decimals
      derivedETH
      id
      mostLiquidPairs {
        dailyTxns
        dailyVolumeToken0
        dailyVolumeToken1
        dailyVolumeUSD
        date
        id
        pairAddress
        reserve0
        reserve1
        reserveUSD
        totalSupply
      }
      name
      symbol
      totalLiquidity
      totalSupply
      tradeVolume
      tradeVolumeUSD
      txCount
      untrackedVolumeUSD
    }
  }
  tokens {
    decimals
    derivedETH
    id
    name
    symbol
    totalLiquidity
    totalSupply
    tradeVolume
    tradeVolumeUSD
    txCount
    untrackedVolumeUSD
    mostLiquidPairs {
      dailyTxns
      dailyVolumeToken0
      dailyVolumeToken1
      dailyVolumeUSD
      date
      id
      pairAddress
      reserve0
      reserve1
      reserveUSD
      totalSupply
    }
  }
  transactions {
    blockNumber
    id
    timestamp
    burns {
      amount0
      amount1
      amountUSD
      feeLiquidity
      feeTo
      id
      liquidity
      logIndex
      needsComplete
      sender
      timestamp
      to
    }
    mints {
      amount0
      amount1
      amountUSD
      feeLiquidity
      feeTo
      id
      liquidity
      logIndex
      sender
      timestamp
      to
    }
    swaps {
      amount0In
      amount0Out
      amount1In
      amount1Out
      amountUSD
      id
      logIndex
      sender
      timestamp
      to
    }
  }
  uniswapDayDatas {
    dailyVolumeETH
    dailyVolumeUSD
    dailyVolumeUntracked
    date
    id
    maxStored
    totalLiquidityETH
    totalLiquidityUSD
    totalVolumeETH
    totalVolumeUSD
    txCount
    mostLiquidTokens {
      dailyTxns
      dailyVolumeETH
      dailyVolumeToken
      dailyVolumeUSD
      date
      id
      maxStored
      priceUSD
      totalLiquidityETH
      totalLiquidityToken
      totalLiquidityUSD
    }
  }
  uniswapFactories {
    id
    pairCount
    totalLiquidityETH
    totalLiquidityUSD
    totalVolumeETH
    totalVolumeUSD
    txCount
    untrackedVolumeUSD
    mostLiquidTokens {
      dailyTxns
      dailyVolumeETH
      dailyVolumeToken
      dailyVolumeUSD
      date
      id
      maxStored
      priceUSD
      totalLiquidityETH
      totalLiquidityToken
      totalLiquidityUSD
    }
  }
  users {
    id
    usdSwapped
    liquidityPositions {
      id
      liquidityTokenBalance
    }
  }
}
`;

const fetchData = async () => {
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
      }),
    });
    const { data } = await response.json();
    console.log("data", data);
  } catch (error) {
    console.log("error", error);
  }
};

fetchData();