import fetch from "node-fetch";
const endpoint = 'https://registry.saber.so/data/pools-info.mainnet.json';

async function getdata() {
  try {
    // Fetch the pools data from the Mango Markets API
    const response = await fetch(endpoint);
    const data = await response.json();

    // Handle the fetched data
    console.log(data);
  } catch (error) {
    // Handle the error
    console.error(error);
  }
}

getdata();
// setInterval(() => {
//   getdata();
// }, 300000);
