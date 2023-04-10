import fetch from "node-fetch";

const url = "https://api.thegraph.com/subgraphs/name/balancer-labs/balancer";

const query = `
query {
  pools {
    createTime
    cap
    controller
    exitsCount
    finalized
    holdersCount
    liquidity
    name
    swapFee
    swapsCount
    symbol
    tokensCount
    tokensList
    totalShares
    totalSwapFee
    totalSwapVolume
    tx
    swaps {
      caller
      feeValue
      poolAddress {
        symbol
        name
        active
        id
        liquidity
        tokensList
      }
      poolLiquidity
      poolTotalSwapFee
      poolTotalSwapVolume
      timestamp
      tokenAmountIn
      tokenAmountOut
      tokenIn
      tokenInSym
      tokenOut
      value
      userAddress {
        txs {
          tx
          block
          timestamp
        }
        id
      }
    }
    tokens {
      address
      balance
      decimals
      name
      symbol
      poolId {
        name
        symbol
        active
        id
        liquidity
        swapFee
        totalSwapFee
        totalSwapVolume
        tx
        swapsCount
      }
    }
    publicSwap
    crp
    crpController
    id
    active
  }
}
`;

let responseData;

async function getBalancerData() {
  try {
    const options = {
      method: "POST",
      body: JSON.stringify({ query }),
      headers: { "Content-Type": "application/json" },
    };
    const response = await fetch(url, options);
    const { data } = await response.json();
    responseData = data; // Initialize global variable with response data
    console.log(responseData);

    // Write response data to file
    // const fileName = "balancer_data.json";
    // fs.writeFileSync(fileName, JSON.stringify(responseData));
    // console.log(`Data written to file: ${fileName}`);
  } catch (error) {
    console.log("error", error);
  }
}

getBalancerData();
