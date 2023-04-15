import fetch from "node-fetch";
import { Kafka, Partitioners  } from "kafkajs";

let data;
let sendingCount = 1;
async function getDataAndProduce() {

  try {
    const response = await fetch('https://api.mainnet.orca.so/v1/whirlpool/list?whitelisted=true', {
      method: 'GET',
    });
    
    data = await response.json();
  } catch (error) {
    console.log("Error in fetching", error);
  }
//////////////////////////////
  try
    {
         const kafka = new Kafka({
              "clientId": "mydex",
              "brokers" :["Blockchain:9092"]
         })

        const producer = kafka.producer({ createPartitioner: Partitioners.DefaultPartitioner });
        console.log("Connecting.....")

        await producer.connect()
        console.log("Connected!")

        const result =  await producer.send({
            "topic": "orca",
            messages: [{ "value": JSON.stringify(data) }]
        });
        console.log('Send Successfully! at', sendingCount, 'time')
        sendingCount++;
        // await producer.disconnect();
    }
    catch(ex)
    {
        console.error(`Something bad happened ${ex}`)
    }
}

setInterval(() => {
  getDataAndProduce();
}, 3000);