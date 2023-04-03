import fetch from "node-fetch";

const url = "https://api.thegraph.com/subgraphs/name/balancer-labs/balancer";

const query = `
query {
  balancers {
    id
    poolCount
    totalLiquidity
    totalSwapVolume
    totalSwapFee
    txCount
    pools {
      active
      cap
      controller
      createTime
      finalized
      holdersCount
      id
      liquidity
      name
      publicSwap
      swapFee
      swapsCount
      symbol
      tx
      totalWeight
      totalSwapVolume
      totalSwapFee
      totalShares
      tokensList
      tokensCount
      tokens {
        name
        id
        symbol
        address
      }
    }
  }
  poolShares {
    id
    balance
    poolId {
      cap
      active
      createTime
      controller
      holdersCount
      id
      liquidity
      name
      publicSwap
      swapFee
      swapsCount
      symbol
      tokensCount
      tokensList
      tokens {
        name
        symbol
        address
        id
      }
      totalShares
      totalSwapFee
      totalSwapVolume
      totalWeight
      tx
    }
  }
  poolTokens {
    address
    name
    symbol
  }
  pools {
    active
    cap
    controller
    createTime
    crp
    crpController
    exitsCount
    finalized
    holdersCount
    id
    joinsCount
    liquidity
    name
    publicSwap
    rights
    swapFee
    swapsCount
    symbol
    tokensCount
    tokensList
    totalShares
    totalSwapFee
    totalSwapVolume
    totalWeight
    tx
    shares {
      id
      balance
    }
    swaps {
      id
      poolLiquidity
      poolTotalSwapFee
      poolTotalSwapVolume
      timestamp
      tokenAmountIn
      tokenAmountOut
      tokenIn
      tokenInSym
      tokenOut
      tokenOutSym
      value
    }
  }
  swaps {
    id
    feeValue
    caller
    poolAddress {
      tx
      id
      name
      symbol
    }
    poolLiquidity
    timestamp
    tokenIn
    tokenOut
  }
  tokenPrices {
    id
    decimals
    name
    poolLiquidity
    poolTokenId
    price
    symbol
  }
  transactions {
    id
    gasUsed
    gasPrice
    event
    block
    action
    sender
    timestamp
    tx
    poolAddress {
      id
      name
      liquidity
      symbol
      tx
    }
  }
  users {
    id
    sharesOwned {
      id
      balance
    }
    swaps {
      id
      feeValue
      caller
      poolLiquidity
      poolTotalSwapFee
      poolTotalSwapVolume
      timestamp
      tokenAmountIn
      tokenAmountOut
      tokenIn
      tokenInSym
      tokenOut
      tokenOutSym
      value
    }
    txs {
      id
      gasUsed
      gasPrice
      event
      block
      action
      sender
      timestamp
      tx
      poolAddress {
        id
      }
      userAddress {
        id
      }
    }
  }
}
`;

async function getBalancerData() {
  try {
    const options = {
      method: "POST",
      body: JSON.stringify({ query }),
      headers: { "Content-Type": "application/json" },
    };
    const response = await fetch(url, options);
    const { data } = await response.json();
    console.log(data);
  } catch (error) {
    console.log("error", error);
  }
}

getBalancerData();
