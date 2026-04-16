import { io } from "socket.io-client";

const SOCKET_URL = process.env.REACT_APP_WEB_URL || "http://localhost:13002"; // Đảm bảo có URL từ env
const socket = io(SOCKET_URL, { autoConnect: false });

export default socket;