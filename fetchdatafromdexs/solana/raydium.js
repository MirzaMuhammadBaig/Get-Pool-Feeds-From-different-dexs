import fetch from 'node-fetch';

// The Raydium DEX subgraph URL
const RAYDIUM_SUBGRAPH_URL = 'https://api.raydium.io/subgraphs/name/raydium';

// The GraphQL query to fetch all tokens on Raydium DEX
const query = `
  query {
    tokens {
      id
      symbol
      name
      decimals
      tradeVolumeUSD
      tradeVolume24H
      liquidityUSD
      liquidity
      derivedETH
      totalSupply
      priceUSD
      txCount
      createdAtTimestamp
      updatedAtTimestamp
    }
  }
`;

// Fetch data from the Raydium DEX subgraph
fetch(RAYDIUM_SUBGRAPH_URL, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    query,
  }),
})
  .then((res) => res.json())
  .then((data) => console.log(data))
  .catch((err) => console.error(err));
