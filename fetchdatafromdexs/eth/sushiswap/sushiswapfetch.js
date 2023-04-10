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
