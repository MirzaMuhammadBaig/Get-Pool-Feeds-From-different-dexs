import { Kafka } from "kafkajs";

run();
async function run(){
    try
    {
         const kafka = new Kafka({
              "clientId": "mydex",
              "brokers" :["Blockchain:9092"]
         })

        const admin = kafka.admin();
        console.log("Connecting.....")
        await admin.connect()
        console.log("Connected!")
        //A-M, N-Z
        await admin.createTopics({
            "topics": [{
                "topic" : "orca",
                "numPartitions": 4
            }]
        })
        console.log("Created Successfully!")
        await admin.disconnect();
    }
    catch(ex)
    {
        console.error(`Something bad happened ${ex}`)
    }
    finally{
        process.exit(0);
    }
}