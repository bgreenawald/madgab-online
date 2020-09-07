import io from "socket.io-client";

let Socket = io("http://localhost:5000", {'multiplex': false});
export default Socket;