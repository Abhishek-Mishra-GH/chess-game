import { io } from "socket.io-client";

const localhost = "http://localhost:3000";
const testBackend = "https://chess-game-bt8o.onrender.com/";
const droplet = "167.71.224.142";

const socket = io.connect(testBackend);

export default socket;
