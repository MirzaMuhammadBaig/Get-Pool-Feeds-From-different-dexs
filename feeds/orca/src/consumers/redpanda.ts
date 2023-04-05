import { Kafka, Producer } from "kafkajs";
import { PriceFeedConsumer, PriceUpdate } from "../utils";

export class RedPandaConsumer implements PriceFeedConsumer {
  private producer!: Producer;
  private brokers: string[] = [];
  private amm: string;

  constructor(brokerList: string[], amm: string) {
    this.amm = amm;
    this.brokers = brokerList;
  }

  async init() {
    const kafka = new Kafka({
      brokers: this.brokers,
    });
    this.producer = kafka.producer();
    await this.producer.connect();
  }

  async processPriceUpdate(priceUpdate: PriceUpdate) {
    await this.producer.send({
      topic: this.amm,
      messages: [
        {
          key: priceUpdate.tokenA + priceUpdate.tokenB,
          value: JSON.stringify(priceUpdate),
        },
      ],
    });
    console.log(
      `[${priceUpdate.tokenA} + ${priceUpdate.tokenB}] Price: ${priceUpdate.askPrice} | AS: ${priceUpdate.askSize} | BS: ${priceUpdate.bidSize} | Slot: ${priceUpdate.slot} | Type: ${priceUpdate.type}`
    );
  }
}
