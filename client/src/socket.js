import { io } from "socket.io-client";

const localhost = "http://localhost:3000";
const testBackend = "https://chess-game-bt8o.onrender.com/";
const droplet = "http://167.71.224.142:80"

const socket = io(droplet);

export default socket;
