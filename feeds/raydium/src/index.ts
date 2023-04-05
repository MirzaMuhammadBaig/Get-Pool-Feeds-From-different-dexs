import { Connection, PublicKey } from "@solana/web3.js";
import { RaydiumExchangeMonitor } from "./feed/exchange_monitor";
import { initializeMarkets, RPC_ENDPOINT_URL, WEBSOCKET_PORT } from "./utils";
import { WebSocketConsumer } from "./consumers/websocket";
import { RaydiumServer } from "./server";

(async () => {
  const connection = new Connection(RPC_ENDPOINT_URL, "confirmed");

  const webSocketConsumer = new WebSocketConsumer(WEBSOCKET_PORT);
  webSocketConsumer.init();
  const monitor = new RaydiumExchangeMonitor(
    connection,
    new PublicKey("9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin"),
    webSocketConsumer
  );
  const raydiumSymbols = await initializeMarkets();
  const slot = await connection.getSlot();

  monitor.init(raydiumSymbols, slot);
  monitor.startMonitoring();

  const server = new RaydiumServer(monitor);
  server.init();
  server.listen();
})();
