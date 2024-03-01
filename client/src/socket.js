import { io } from "socket.io-client";

const localhost = "http://localhost:3000";
const testBackend = "https://chess-game-bt8o.onrender.com/";
const droplet = "https://test.abhishekcodes.tech";

const socket = io.connect(droplet);

export default socket;
