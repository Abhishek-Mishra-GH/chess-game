import { io } from "socket.io-client";

const localhost = "http://localhost:3000";
const testBackend = "https://chess-game-bt8o.onrender.com/"

const socket = io(localhost);

export default socket;