import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["localhost:9092"]
});

const topicName = "Bancor";

const createTopic = async () => {
  const admin = kafka.admin();
  await admin.connect();
  await admin.createTopics({
    topics: [{ topic: topicName }]
  });
  await admin.disconnect();
  console.log(`Topic "${topicName}" has been created`);
};

createTopic().catch(error => console.error(error));
