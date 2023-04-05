import fetch from "node-fetch";

const endpoint = 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3';

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
  
  pools {
    collectedFeesToken0
    collectedFeesToken1
    collectedFeesUSD
    createdAtBlockNumber
    createdAtTimestamp
    feeGrowthGlobal0X128
    feeGrowthGlobal1X128
    feeTier
    feesUSD
    id
    liquidity
    liquidityProviderCount
    observationIndex
    sqrtPrice
    tick
    token0Price
    token1Price
    totalValueLockedETH
    totalValueLockedToken0
    totalValueLockedToken1
    totalValueLockedUSD
    totalValueLockedUSDUntracked
    txCount
    untrackedVolumeUSD
    volumeToken0
    volumeToken1
    volumeUSD
    burns {
      amount
      amount0
      amount1
      amountUSD
      id
      logIndex
      origin
      owner
      tickLower
      tickUpper
      timestamp
      token0 {
        symbol
        name
        decimals
        derivedETH
        feesUSD
        id
        poolCount
        totalSupply
        totalValueLocked
        totalValueLockedUSD
        totalValueLockedUSDUntracked
        txCount
        untrackedVolumeUSD
        volume
        volumeUSD
        whitelistPools {
          collectedFeesToken0
          collectedFeesToken1
          collectedFeesUSD
          createdAtBlockNumber
          createdAtTimestamp
          feeGrowthGlobal0X128
          feeGrowthGlobal1X128
          feeTier
          feesUSD
          id
          liquidity
          liquidityProviderCount
          observationIndex
          sqrtPrice
          tick
        }
      }
      token1 {
        name
        symbol
        decimals
        derivedETH
        feesUSD
        id
        poolCount
        totalSupply
        totalValueLocked
        totalValueLockedUSD
        totalValueLockedUSDUntracked
        txCount
        untrackedVolumeUSD
        volume
        volumeUSD
        whitelistPools {
          collectedFeesToken0
          collectedFeesToken1
          collectedFeesUSD
          createdAtBlockNumber
          feeGrowthGlobal0X128
          createdAtTimestamp
          feeGrowthGlobal1X128
          feeTier
          feesUSD
          id
          liquidity
          liquidityProviderCount
          observationIndex
          sqrtPrice
          tick
        }
      }
    }
    collects {
      amount0
      amount1
      amountUSD
      id
      logIndex
      owner
      tickLower
      tickUpper
      timestamp
    }
    mints {
      amount
      amount0
      amount1
      amountUSD
      id
      logIndex
      origin
      owner
      sender
      tickLower
      tickUpper
      timestamp
      token0 {
        name
        symbol
      }
      token1 {
        name
        symbol
      }
    }
    swaps {
      amount0
      amount1
      amountUSD
      id
      logIndex
      origin
      recipient
      sender
      sqrtPriceX96
      tick
      timestamp
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
}
`;

async function getUniswapData() {
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });
    const { data } = await response.json();
    console.log("data", data);

  } catch (error) {
    console.log("error", error);
  }

  // const data = await response.json();

  // const pools = data.data.pools;

  // return pools.map(pool => {
  //   const token0Symbol = pool.token0.symbol;
  //   const token1Symbol = pool.token1.symbol;
  //   const pair = `${token0Symbol}-${token1Symbol}`;
  //   const poolAddress = pool.id;
  //   const liquidity = pool.liquidity;
  //   const token0Price = pool.sqrtPrice / (2 ** 96);
  //   const token1Price = 1 / token0Price;
  //   const feeTier = pool.feeTier;
  //   const tick = pool.tick;

  //   return {
  //     pair,
  //     poolAddress,
  //     liquidity,
  //     token0Price,
  //     token1Price,
  //     feeTier,
  //     tick,
  //   };
  // });
}

getUniswapData();
