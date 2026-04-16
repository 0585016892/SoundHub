import { io } from "socket.io-client";

let socket = null;

export function connectOrderSocket(userId) {
    if (!socket) {
        socket = io(process.env.REACT_APP_WEB_URL, {
        query: { userId },
        transports: ["websocket"]
        });
    }
  socket.on("connect", () => {
    console.log("✅ Order socket FE connected:", socket.id);
    socket.emit("join", { userId, isAdmin: false }); // join chung
    socket.emit("joinOrder", { userId });
  });

  return socket;
}

export function getOrderSocket() {
  return socket;
}
