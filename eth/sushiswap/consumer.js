import { Kafka } from "kafkajs";

run();
async function run(){
    try
    {
         const kafka = new Kafka({
              "clientId": "mydex",
              "brokers" :["Blockchain:9092"]
         })

        const consumer = kafka.consumer({"groupId": "data"})
        console.log("Connecting.....")
        await consumer.connect()
        console.log("Connected!")
        
        await consumer.subscribe({
            "topic": "sushiswap",
            "fromBeginning": true
        })
        
        await consumer.run({
            "eachMessage": async result => {
                console.log(`RVD Msg ${result.message.value} on partition ${result.partition}`)
            }
        })
    }
    catch(ex)
    {
        console.error(`Something bad happened ${ex}`)
    }
}