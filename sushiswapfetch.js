import fetch from "node-fetch";

const endpoint = "https://api.thegraph.com/subgraphs/name/sushiswap-subgraphs/sushiswap-arbitrum";

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
    id
    nativePrice
  }
  burns {
    amount0
    amount1
    amountUSD
    complete
    feeTo
    feeLiquidity
    id
    liquidity
    logIndex
    timestamp
    to
    sender
    pair {
      liquidityUSD
      name
      reserve0
      reserve1
      swapFee
      token0 {
        name
        symbol
        txCount
      }
      token1 {
        name
        symbol
        txCount
      }
      token0Price
      token1Price
      volumeToken0
      volumeToken1
      volumeUSD
    }
    transaction {
      createdAtBlock
      createdAtTimestamp
      gasLimit
      gasPrice
    }
  }
  factories {
    feesNative
    feesUSD
    id
    liquidityNative
    liquidityUSD
    pairCount
    tokenCount
    transactionCount
    type
    userCount
    volumeNative
    volumeUSD
  }
  factoryDaySnapshots {
    date
    feesNative
    feesUSD
    id
    liquidityNative
    liquidityUSD
    transactionCount
    volumeNative
    volumeUSD
    factory {
      feesNative
      feesUSD
      id
      liquidityNative
      liquidityUSD
      pairCount
      tokenCount
      transactionCount
      type
      userCount
      volumeNative
      volumeUSD
    }
  }
  factoryHourSnapshots {
    date
    feesNative
    feesUSD
    id
    liquidityNative
    liquidityUSD
    transactionCount
    volumeNative
    volumeUSD
    factory {
      feesNative
      feesUSD
      id
      liquidityNative
      liquidityUSD
      pairCount
      tokenCount
      transactionCount
      type
      userCount
      volumeNative
      volumeUSD
    }
  }
  liquidityPositionSnapshots {
    block
    id
    liquidityTokenBalance
    liquidityTokenTotalSupply
    reserve0
    reserve1
    reserveUSD
    timestamp
    token0PriceUSD
    token1PriceUSD
    pair {
      name
      token0 {
        symbol
        name
        volumeUSD
        price {
          lastUsdPrice
        }
      }
      token1 {
        name
        symbol
        volumeUSD
        price {
          lastUsdPrice
        }
      }
      token0Price
      token1Price
      volumeUSD
    }
  }
  liquidityPositions {
    balance
    createdAtBlock
    createdAtTimestamp
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
  mints {
    amount0
    amount1
    amountUSD
    feeLiquidity
    feeTo
    id
    liquidity
    sender
    timestamp
    to
  }
  pairDaySnapshots {
    liquidity
    date
    feesNative
    feesUSD
    liquidityNative
    liquidityUSD
    transactionCount
    volumeNative
    volumeToken0
    volumeToken1
    volumeUSD
    pair {
      type
      name
      reserve0
      reserve1
      token0 {
        name
        symbol
      }
      token1 {
        name
        symbol
      }
      token0Price
      token1Price
    }
  }
  pairHourSnapshots {
    date
    feesNative
    feesUSD
    id
    liquidity
    liquidityNative
    liquidityUSD
    transactionCount
    volumeNative
    volumeToken0
    volumeToken1
    volumeUSD
  }
  pairs {
    createdAtBlock
    createdAtTimestamp
    feesNative
    feesUSD
    id
    liquidity
    liquidityNative
    liquidityUSD
    name
    reserve0
    reserve1
    source
    swapFee
    token0Price
    token1Price
    trackedLiquidityNative
    twapEnabled
    txCount
    type
    volumeNative
    volumeToken0
    volumeToken1
    volumeUSD
    token0 {
      decimals
      feesNative
      feesUSD
      id
      liquidity
      liquidityNative
      liquidityUSD
      name
      nameSuccess
      pairCount
      symbol
      txCount
      volume
      volumeNative
      volumeUSD
    }
    token1 {
      decimals
      feesNative
      feesUSD
      id
      liquidity
      liquidityNative
      liquidityUSD
      name
      nameSuccess
      pairCount
      symbol
      symbolSuccess
      txCount
      volume
      volumeNative
      volumeUSD
    }
  }
  swaps {
    amountIn
    amountOut
    amountUSD
    id
    sender
    timestamp
    to
    tokenIn {
      decimals
      feesNative
      feesUSD
      liquidity
      liquidityNative
      liquidityUSD
      name
      pairCount
      symbol
      txCount
      volume
      volumeNative
      volumeUSD
    }
    tokenOut {
      decimals
      feesNative
      feesUSD
      id
      liquidity
      liquidityNative
      liquidityUSD
      name
      pairCount
      symbol
      symbolSuccess
      txCount
      volume
      volumeNative
      volumeUSD
    }
    transaction {
      createdAtBlock
      createdAtTimestamp
      gasLimit
      gasPrice
      id
    }
  }
  tokenDaySnapshots {
    date
    feesNative
    feesUSD
    id
    liquidity
    liquidityNative
    liquidityUSD
    priceNative
    priceUSD
    transactionCount
    volume
    volumeNative
    volumeUSD
    token {
      name
      symbol
      volumeUSD
      volume
    }
  }
  tokenHourSnapshots {
    date
    feesNative
    feesUSD
    id
    liquidity
    liquidityNative
    liquidityUSD
    priceNative
    priceUSD
    transactionCount
    volume
    volumeNative
    volumeUSD
    token {
      decimals
      decimalsSuccess
      feesNative
      feesUSD
      id
      liquidity
      liquidityNative
      liquidityUSD
      name
      nameSuccess
      pairCount
      symbol
      symbolSuccess
      txCount
      volume
      volumeNative
      volumeUSD
      price {
        lastUsdPrice
      }
    }
  }
  tokenPairs {
    pair {
      token0 {
        name
        symbol
        txCount
      }
      token1 {
        name
        symbol
        txCount
      }
    }
  }
  tokenPrices {
    lastUsdPrice
  }
  tokens {
    decimals
    decimalsSuccess
    feesNative
    feesUSD
    id
    liquidity
    liquidityNative
    liquidityUSD
    name
    nameSuccess
    pairCount
    symbolSuccess
    txCount
    volume
    volumeNative
    volumeUSD
    symbol
  }
  transactions {
    createdAtBlock
    createdAtTimestamp
    gasLimit
    gasPrice
    id
  }
  users {
    id
    liquidityPositions {
      balance
      createdAtBlock
      createdAtTimestamp
      id
    }
    lpSnapshotsCount
  }
}
`;

async function getSushiswapData() {
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
}

getSushiswapData();
