fetch('https://api.thegraph.com/subgraphs/name/dodoex/dodo-uniswap-v3-mainnet', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    query: `
      {
        pools{
          id
          token0{
            id
            symbol
            name
            decimals
            totalSupply
            volumeUSD
          }
          token1{
            id
            symbol
            name
            decimals
            totalSupply
            volumeUSD
          }
        }
        tokens{
          id
          symbol
          name
          decimals
          totalSupply
          poolCount
          volumeUSD
        }
      }
    `
  })
})
.then(response => response.json())
.then(data => {
  console.log(JSON.stringify(data, null, 2))})
.catch(error => {
  console.error(error);
});
