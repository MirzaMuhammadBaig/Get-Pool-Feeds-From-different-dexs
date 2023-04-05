import express from "express";
import bodyparser from "body-parser";
import cors from "cors";
import { SaberExchangeMonitor } from "./feed/exchange_monitor";
import { SERVER_PORT } from "./utils";

export class SaberServer {
  private exchangeMonitor: SaberExchangeMonitor;
  private app: express.Express;

  constructor(exchangeMonitor: SaberExchangeMonitor) {
    this.exchangeMonitor = exchangeMonitor;
    this.app = express();
  }

  public init() {
    // body-parser middleware
    this.app.use(bodyparser.urlencoded({ extended: true }));
    this.app.use(bodyparser.json());

    // cors middleware
    this.app.use(cors());
    this.addRoutes();
  }

  public listen() {
    this.app.listen(SERVER_PORT, () =>
      console.log(`Server running on port ${SERVER_PORT}`)
    );
  }

  private addRoutes() {
    this.app.get("/getMarkets", (req, res) => {
      const markets = this.exchangeMonitor.getMarkets();
      res.json(JSON.stringify(markets));
    });

    this.app.get("/getState", (req, res) => {
      res.json(JSON.stringify(this.exchangeMonitor.getState()));
    });
  }
}