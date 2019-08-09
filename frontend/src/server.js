const io = require('socket.io')();

io.on('connection', (client) => {

})

const port = 8000;
io.listen(port);
console.log('Socket io listening on port', port)