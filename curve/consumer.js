import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["localhost:9092"]
});

const topicName = "Curve";

const consumer = kafka.consumer({ groupId: "test-group" });

const consumeMessages = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: topicName });
  await consumer.run({
    eachMessage: async ({ message }) => {
      console.log(`Received message: ${message.value.toString()}`);
    }
  });
};

consumeMessages().catch(error => console.error(error));
