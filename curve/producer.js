import { Kafka } from "kafkajs";


const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["localhost:9092"]
});

const topicName = "Bancor";

const producer = kafka.producer();

const sendMessage = async message => {
  await producer.connect();
  await producer.send({
    topic: topicName,
    messages: [{ value: JSON.stringify(message) }]
  });
  await producer.disconnect();
  console.log(`Message sent: ${JSON.stringify(message)}`);
};

const endpointUrl = 'https://api.thegraph.com/subgraphs/name/messari/curve-finance-ethereum';

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

const fetchOptions = {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ query })
};

fetch(endpointUrl, fetchOptions)
  .then(response => response.json())
  .then(data => sendMessage(data))
  .catch(error => console.error(error));
