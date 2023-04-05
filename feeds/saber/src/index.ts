import { Connection } from "@solana/web3.js";
import { WebSocketConsumer } from "./consumers/websocket";
import { SaberExchangeMonitor } from "./feed/exchange_monitor";
import { SaberServer } from "./server";
import { RPC_ENDPOINT_URL, WEBSOCKET_PORT } from "./utils";

(async function main() {
  const connection = new Connection(RPC_ENDPOINT_URL, "confirmed");
  const webSocketConsumer = new WebSocketConsumer(WEBSOCKET_PORT);
  webSocketConsumer.init();
  const exchangeMonitor = new SaberExchangeMonitor(
    connection,
    webSocketConsumer
  );
  await exchangeMonitor.init();
  exchangeMonitor.startMonitoring();

  // Saber Server
  const server = new SaberServer(exchangeMonitor);
  server.init();
  server.listen();
})();
