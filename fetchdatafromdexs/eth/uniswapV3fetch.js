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
  bundles {
    ethPriceUSD
    id
  }
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
    pool {
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
  factories {
    id
    owner
    poolCount
    totalFeesETH
    totalFeesUSD
    totalValueLockedETH
    totalValueLockedETHUntracked
    totalValueLockedUSD
    totalValueLockedUSDUntracked
    totalVolumeETH
    totalVolumeUSD
    txCount
    untrackedVolumeUSD
  }
  flashes {
    amount0
    amount0Paid
    amount1
    amount1Paid
    amountUSD
    id
    logIndex
    recipient
    sender
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
  }
  poolDayDatas {
    close
    date
    feeGrowthGlobal0X128
    feeGrowthGlobal1X128
    feesUSD
    high
    id
    liquidity
    low
    open
    sqrtPrice
    tick
    token0Price
    token1Price
    tvlUSD
    txCount
    volumeToken0
    volumeToken1
    volumeUSD
  }
  poolHourDatas {
    close
    feeGrowthGlobal0X128
    feeGrowthGlobal1X128
    feesUSD
    high
    id
    liquidity
    low
    open
    periodStartUnix
    sqrtPrice
    tick
    token0Price
    token1Price
    tvlUSD
    txCount
    volumeToken0
    volumeToken1
    volumeUSD
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
  positionSnapshots {
    blockNumber
    depositedToken0
    depositedToken1
    feeGrowthInside0LastX128
    feeGrowthInside1LastX128
    id
    liquidity
    owner
    timestamp
    withdrawnToken0
    withdrawnToken1
  }
  positions {
    collectedFeesToken0
    collectedFeesToken1
    depositedToken0
    depositedToken1
    feeGrowthInside0LastX128
    feeGrowthInside1LastX128
    id
    liquidity
    owner
    withdrawnToken0
    withdrawnToken1
    pool {
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
      decimals
      derivedETH
      feesUSD
      id
      name
      poolCount
      symbol
      totalSupply
      totalValueLocked
      totalValueLockedUSD
      totalValueLockedUSDUntracked
      txCount
      untrackedVolumeUSD
      volume
      volumeUSD
    }
    pool {
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
        timestamp
        tickUpper
      }
      poolDayData {
        close
        date
        feeGrowthGlobal0X128
        feeGrowthGlobal1X128
        feesUSD
        high
        id
        liquidity
        low
        open
        sqrtPrice
        tick
        token0Price
        token1Price
        tvlUSD
        txCount
        volumeToken0
        volumeToken1
        volumeUSD
      }
      poolHourData {
        close
        feeGrowthGlobal0X128
        feeGrowthGlobal1X128
        feesUSD
        high
        id
        liquidity
        low
        open
        periodStartUnix
        sqrtPrice
        tick
        token0Price
        token1Price
        tvlUSD
        txCount
        volumeToken0
        volumeToken1
        volumeUSD
      }
      ticks {
        collectedFeesToken0
        collectedFeesToken1
        collectedFeesUSD
        createdAtBlockNumber
        createdAtTimestamp
        feeGrowthOutside0X128
        feeGrowthOutside1X128
        feesUSD
        id
        liquidityGross
        liquidityNet
        liquidityProviderCount
        poolAddress
        price0
        price1
        tickIdx
        untrackedVolumeUSD
        volumeToken0
        volumeToken1
        volumeUSD
      }
      token0 {
        decimals
        derivedETH
        feesUSD
        id
        name
        poolCount
        symbol
        totalSupply
        totalValueLocked
        totalValueLockedUSD
        totalValueLockedUSDUntracked
        txCount
        untrackedVolumeUSD
        volume
        volumeUSD
      }
      token1 {
        decimals
        derivedETH
        feesUSD
        id
        name
        poolCount
        symbol
        totalSupply
        totalValueLocked
        totalValueLockedUSD
        totalValueLockedUSDUntracked
        txCount
        untrackedVolumeUSD
        volume
        volumeUSD
      }
    }
    token1 {
      decimals
      derivedETH
      feesUSD
      id
      name
      poolCount
      symbol
      totalSupply
      totalValueLocked
      totalValueLockedUSD
      totalValueLockedUSDUntracked
      txCount
      untrackedVolumeUSD
      volume
      volumeUSD
    }
  }
  tickDayDatas {
    date
    feeGrowthOutside0X128
    feeGrowthOutside1X128
    feesUSD
    id
    liquidityGross
    liquidityNet
    volumeToken0
    volumeToken1
    volumeUSD
  }
  tickHourDatas {
    feesUSD
    id
    liquidityGross
    liquidityNet
    periodStartUnix
    volumeToken0
    volumeToken1
    volumeUSD
  }
  ticks {
    collectedFeesToken0
    collectedFeesToken1
    collectedFeesUSD
    createdAtBlockNumber
    createdAtTimestamp
    feeGrowthOutside0X128
    feeGrowthOutside1X128
    feesUSD
    id
    liquidityGross
    liquidityNet
    liquidityProviderCount
    poolAddress
    price0
    price1
    tickIdx
    untrackedVolumeUSD
    volumeToken0
    volumeToken1
    volumeUSD
  }
  tokenDayDatas {
    close
    date
    feesUSD
    id
    high
    low
    open
    priceUSD
    totalValueLocked
    totalValueLockedUSD
    untrackedVolumeUSD
    volume
    volumeUSD
  }
  tokenHourDatas {
    close
    feesUSD
    high
    id
    low
    open
    periodStartUnix
    priceUSD
    totalValueLocked
    totalValueLockedUSD
    untrackedVolumeUSD
    volume
    volumeUSD
  }
  tokens {
    decimals
    derivedETH
    feesUSD
    id
    name
    poolCount
    symbol
    totalSupply
    totalValueLocked
    totalValueLockedUSD
    totalValueLockedUSDUntracked
    txCount
    untrackedVolumeUSD
    volume
    volumeUSD
  }
  transactions {
    blockNumber
    gasPrice
    gasUsed
    id
    timestamp
  }
  uniswapDayDatas {
    date
    feesUSD
    id
    tvlUSD
    txCount
    volumeETH
    volumeUSD
    volumeUSDUntracked
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
