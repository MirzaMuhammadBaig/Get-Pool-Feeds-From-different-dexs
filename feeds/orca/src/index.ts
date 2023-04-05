import { RPC_ENDPOINT_URL, WEBSOCKET_PORT } from "./utils";
import { OrcaExchangeMonitor } from "./feed/exchange_monitor";
import { WebSocketConsumer } from "./consumers/websocket";
import { Connection } from "@solana/web3.js";
import { OrcaServer } from "./server";

(async () => {
  const webSocketConsumer = new WebSocketConsumer(WEBSOCKET_PORT);
  webSocketConsumer.init();
  const connection = new Connection(RPC_ENDPOINT_URL, "confirmed");

  const slot = await connection.getSlot();
  const orcaExchangeMonitor = new OrcaExchangeMonitor(
    RPC_ENDPOINT_URL,
    webSocketConsumer,
    slot
  );
  const server = new OrcaServer(orcaExchangeMonitor);
  server.init();
  server.listen();
  orcaExchangeMonitor.startMonitoring();
})();
