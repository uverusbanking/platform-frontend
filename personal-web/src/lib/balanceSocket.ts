import { io, Socket } from "socket.io-client";

// VITE_SOCKET_URL lets you point the socket at a different host than the REST API.
// e.g. VITE_SOCKET_URL=http://localhost:4000 while REST hits staging.
// Falls back to VITE_API_URL, then localhost:4000.
const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:4000";

const NAMESPACE = "/banking";

export interface BalanceUpdatedPayload {
  customerId: string;
  walletId: string;
  currency: string; // e.g. "NGN"
  balance: string; // current balance after operation
  balanceBefore: string;
  event: "wallet.credit" | "wallet.debit" | "wallet.transfer";
  reference: string;
  amount: string;
  description: string;
  timestamp: string; // ISO 8601
}

type BalanceUpdateHandler = (payload: BalanceUpdatedPayload) => void;
type ConnectedHandler = (data: unknown) => void;

let socket: Socket | null = null;
let balanceHandlers: Set<BalanceUpdateHandler> = new Set();
let connectedHandlers: Set<ConnectedHandler> = new Set();

/** Connect to the banking namespace with a JWT token. Idempotent. */
export function connectBalanceSocket(token: string): void {
  if (socket?.connected) return;

  // Disconnect any stale socket before reconnecting with a new token
  if (socket) {
    socket.disconnect();
    socket = null;
  }

  console.debug("[BalanceSocket] connecting to:", SOCKET_URL + NAMESPACE);

  socket = io(`${SOCKET_URL}${NAMESPACE}`, {
    auth: { token },
    transports: ["websocket"],
    reconnection: false, // disable auto-retry — caller can reconnect on token refresh
    timeout: 8000,
  });

  socket.on("connect", () => {
    console.debug("[BalanceSocket] connected:", socket?.id);
  });

  socket.on("connected", (data) => {
    connectedHandlers.forEach((h) => h(data));
  });

  socket.on("balance.updated", (payload: BalanceUpdatedPayload) => {
    balanceHandlers.forEach((h) => h(payload));
  });

  socket.on("disconnect", (reason) => {
    console.debug("[BalanceSocket] disconnected:", reason);
  });

  // Log only once per connection attempt, not on every retry
  let errorLogged = false;
  socket.on("connect_error", (err) => {
    if (!errorLogged) {
      console.warn(
        "[BalanceSocket] connection error (will retry up to 3×):",
        err.message,
        "\nSocket URL:",
        SOCKET_URL + NAMESPACE,
        "\nTip: set VITE_SOCKET_URL in your .env to override the socket host.",
      );
      errorLogged = true;
    }
  });
}

/** Disconnect and clean up the socket. */
export function disconnectBalanceSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

/** Register a handler for balance.updated events. Returns a cleanup fn. */
export function onBalanceUpdated(handler: BalanceUpdateHandler): () => void {
  balanceHandlers.add(handler);
  return () => balanceHandlers.delete(handler);
}

/** Register a handler for the server-sent 'connected' event. Returns a cleanup fn. */
export function onSocketConnected(handler: ConnectedHandler): () => void {
  connectedHandlers.add(handler);
  return () => connectedHandlers.delete(handler);
}

export function isBalanceSocketConnected(): boolean {
  return socket?.connected ?? false;
}
