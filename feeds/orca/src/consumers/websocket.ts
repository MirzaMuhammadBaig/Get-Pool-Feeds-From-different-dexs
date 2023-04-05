import WebSocketServer from "ws";
import { PriceFeedConsumer, PriceUpdate } from "../utils";

export class WebSocketConsumer implements PriceFeedConsumer {
  private subscribers: WebSocketServer[] = [];
  private server: WebSocketServer.Server;

  constructor(serverPort: number) {
    this.server = new WebSocketServer.Server({ port: serverPort });
  }

  init() {
    this.server.on("connection", (ws) => {
      this.subscribers.push(ws);
      console.log("New subscriber connected!");
      ws.on("close", () => {
        console.log("Subscriber has disconnected!");
      });
      ws.onerror = function () {
        console.log("Some error occured on client connection!");
      };
    });
    return Promise.resolve();
  }

  processPriceUpdate(priceUpdate: PriceUpdate): Promise<void> {
    // Filter out less liquid pools
    if (priceUpdate.bidSize + priceUpdate.askSize < 500) {
      console.log("Volume too low");
      return Promise.resolve();
    }
    console.log(
      `[${priceUpdate.tokenA} + ${priceUpdate.tokenB}] Price: ${priceUpdate.askPrice} | AS: ${priceUpdate.askSize} | BS: ${priceUpdate.bidSize} | Slot: ${priceUpdate.slot} | Type: ${priceUpdate.type}`
    );
    this.subscribers.forEach((subscriber) => {
      subscriber.send(JSON.stringify(priceUpdate));
    });
    return Promise.resolve();
  }
}
