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
      transaction {
        block
        timestamp
      }
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
      transaction {
        block
        timestamp
      }
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
      to
      transaction {
        block
        timestamp
      }
    }
    token0 {
      decimals
      derivedBNB
      derivedUSD
      name
      symbol
      totalLiquidity
      totalTransactions
      tradeVolume
      tradeVolumeUSD
    }
    token1 {
      decimals
      derivedBNB
      derivedUSD
      name
      symbol
      totalLiquidity
      totalTransactions
      tradeVolume
      tradeVolumeUSD
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
