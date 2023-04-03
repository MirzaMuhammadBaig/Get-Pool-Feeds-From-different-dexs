import fetch from "node-fetch";

const endpoint = "https://api.thegraph.com/subgraphs/name/ehtec/pancake-subgraph-v2";

const query = `
query {
  _meta {
    deployment
    hasIndexingErrors
    block {
      hash
      number
      timestamp
    }
  }
  bundles {
    bnbPrice
    id
  }
  burns {
    id
    feeTo
    feeLiquidity
    amountUSD
    amount1
    amount0
    liquidity
    logIndex
    needsComplete
    sender
    timestamp
    to
    pair {
      name
      token0 {
        name
        symbol
        totalTransactions
      }
      token1 {
        name
        symbol
        totalTransactions
      }
      totalTransactions
      token0Price
      token1Price
    }
  }
  mints {
    id
    feeTo
    feeLiquidity
    amountUSD
    amount1
    amount0
    liquidity
    logIndex
    sender
    timestamp
    to
    pair {
      name
      token0 {
        name
        symbol
        totalTransactions
      }
      token1 {
        name
        symbol
        totalTransactions
      }
      token0Price
      token1Price
      totalTransactions
    }
  }
  pairDayDatas {
    dailyTxns
    dailyVolumeToken0
    dailyVolumeToken1
    dailyVolumeUSD
    date
    pairAddress
    reserve0
    reserve1
    reserveUSD
    totalSupply
    token0 {
      name
      symbol
    }
    token1 {
      name
      symbol
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
    totalSupply
    pair {
      block
      id
      name
      reserve0
      reserve1
      reserveBNB
      reserveUSD
      timestamp
      token0Price
      token1Price
      totalSupply
      totalTransactions
      trackedReserveBNB
      untrackedVolumeUSD
      volumeToken0
      volumeToken1
      volumeUSD
      token0 {
        name
        symbol
        totalTransactions
      }
      token1 {
        name
        symbol
        totalTransactions
      }
    }
  }
  pairs {
    id
    block
    name
    reserve0
    reserve1
    reserveUSD
    reserveBNB
    timestamp
    token0Price
    token1Price
    totalSupply
    totalTransactions
    trackedReserveBNB
    untrackedVolumeUSD
    volumeToken0
    volumeToken1
    volumeUSD
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
  }
  pancakeDayDatas {
    dailyVolumeBNB
    dailyVolumeUSD
    dailyVolumeUntracked
    date
    id
    totalLiquidityBNB
    totalLiquidityUSD
    totalTransactions
    totalVolumeBNB
    totalVolumeUSD
  }
  pancakeFactories {
    id
    totalLiquidityBNB
    totalLiquidityUSD
    totalPairs
    totalTransactions
    totalVolumeBNB
    totalVolumeUSD
    untrackedVolumeUSD
  }
  swaps {
    amount0In
    amount0Out
    amount1In
    amount1Out
    amountUSD
    from
    id
    logIndex
    sender
    timestamp
    pair {
      token0 {
        name
        symbol
        totalTransactions
      }
      token1 {
        name
        symbol
        totalTransactions
      }
      totalTransactions
    }
  }
  tokenDayDatas {
    dailyTxns
    dailyVolumeBNB
    dailyVolumeToken
    dailyVolumeUSD
    date
    id
    priceUSD
    totalLiquidityBNB
    totalLiquidityToken
    totalLiquidityUSD
    token {
      name
      symbol
      totalTransactions
    }
  }
  tokens {
    decimals
    derivedBNB
    derivedUSD
    id
    name
    symbol
    totalLiquidity
    totalTransactions
    tradeVolume
    tradeVolumeUSD
    untrackedVolumeUSD
  }
  transactions {
    block
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
      transaction {
        id
      }
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
      transaction {
        id
      }
    }
    swaps {
      amount0In
      amount0Out
      amount1In
      amount1Out
      from
      amountUSD
      id
      logIndex
      sender
      timestamp
      to
      transaction {
        id
      }
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
