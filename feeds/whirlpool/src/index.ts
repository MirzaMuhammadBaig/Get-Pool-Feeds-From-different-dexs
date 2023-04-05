import { AllWhirlpoolMonitor } from "./feed/whirlpool_monitor";
import { Connection } from "@solana/web3.js";
import { ORCA_WHIRLPOOL_PROGRAM_ID } from "@orca-so/whirlpools-sdk";
import { RPC_ENDPOINT_URL, WEBSOCKET_PORT } from "./utils";
import { WebSocketConsumer } from "./consumers/websocket";
import { WhirlpoolServer } from "./server";

const commitment = "confirmed";
const connection = new Connection(RPC_ENDPOINT_URL, commitment);

(async () => {
  const webSocketConsumer = new WebSocketConsumer(WEBSOCKET_PORT);

  const allWhirlpoolMonitor = new AllWhirlpoolMonitor(
    connection,
    ORCA_WHIRLPOOL_PROGRAM_ID,
    webSocketConsumer
  );
  await allWhirlpoolMonitor.init();
  allWhirlpoolMonitor.startMonitoring(await connection.getSlot());

  // WhirlpoolServer
  const server = new WhirlpoolServer(allWhirlpoolMonitor);
  server.init();
  server.listen();
})();
