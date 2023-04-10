import fetch from "node-fetch";
// The Mango Markets API endpoint to fetch the pools data
const endpoint = 'https://api.raydium.io/pairs';

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
