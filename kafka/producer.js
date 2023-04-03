console.log("Producer....");

import { Kafka } from "kafkajs";

const kafka = new Kafka({
  brokers: ["localhost:9092"],
});

const producer = kafka.producer();

let number = 1;

async function queueMessage() {
  await producer.send({
    topic: "test",
    messages: [{ value: "hi" }],
  });
  number++;
  console.log(`${number}: Message produced`);
}

async function run() {
  await producer.connect();
  setInterval(queueMessage, 3000);
}

run().catch(console.error);
