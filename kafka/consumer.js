console.log("Consumer....");

import { Kafka } from "kafkajs";

const kafka = new Kafka({
  brokers: ["localhost:9092"],
});

const consumer = kafka.consumer({ groupId: "kafka" });

let number = 1;

async function run() {
  await consumer.connect();
  console.log("consumer ready...");
  await consumer.subscribe({ topic: "test", fromBeginning: true });
  await consumer.run({
    eachMessage: ({ topic, partition, message }) => {
        number++;
      console.log(`${number}: received message: ${message.value.toString()}`);
    },
  });
}

run().catch(console.error);
