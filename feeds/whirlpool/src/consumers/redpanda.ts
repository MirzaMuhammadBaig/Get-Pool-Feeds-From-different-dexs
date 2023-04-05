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

  async processPriceUpdate(result: PriceUpdate) {
    await this.producer.send({
      topic: this.amm,
      messages: [
        {
          key: result.tokenA + result.tokenB,
          value: JSON.stringify(result),
        },
      ],
    });
    console.log(
      `[${result.tokenA} + ${result.tokenB}] Price: ${result.askPrice} | AS: ${result.askSize} | BS: ${result.bidSize} | Slot: ${result.slot} | Type: ${result.type}`
    );
  }
}
