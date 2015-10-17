var io = module.parent.exports.io;

io.on('connection', function(socket) {
    console.log("Socket connected.");

    socket.emit('welcome', {message: "H A W O R T H"});
    
    socket.on('disconnect', function () {
        console.log('socket disconnected');
    });
});