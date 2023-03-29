const endpoint = 'https://api.thegraph.com/subgraphs/name/messari/curve-finance-ethereum';

const query = `
{
  liquidityPools{
    id
    name
    symbol
    _registryAddress 
  }
  
  tokens{
    id
    name
    symbol
    decimals
    lastPriceUSD
    lastPriceBlockNumber
  }
  
}`;

fetch(endpoint, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ query })
})
.then(res => res.json())
.then(data => console.log(JSON.stringify(data, null, 2)))
.catch(err => console.error(err));
