import io from "socket.io-client";

let Socket = io(process.env.REACT_APP_BACKEND_URL, {'multiplex': false});
export default Socket;