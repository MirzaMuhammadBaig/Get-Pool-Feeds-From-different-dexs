const endpointUrl = "https://api.thegraph.com/subgraphs/name/messari/bancor-v3-ethereum";

const query = `
{
  liquidityPools{
    id
    name
    symbol
  }
  tokens {
    id
    name
    symbol
    decimals
    lastPriceUSD
    _poolToken{
      name
      symbol
      decimals
    }
  }
}`;

const fetchOptions = {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ query })
};

fetch(endpointUrl, fetchOptions)
  .then(response => response.json())
  .then(data => console.log(JSON.stringify(data, null, 2)))
  .catch(error => console.error(error));
