const express = require('express');
const app = express();
const socketio = require('socket.io');

let namespaces = require('./data/namespaces');
app.use(express.static(__dirname + '/public'));

const expressServer = app.listen(9000);

const io = socketio(expressServer);

io.on('connection', (socket) => {
	let nsData = namespaces.map((ns) => ({
		img: ns.img,
		endpoint: ns.endpoint,
	}));

	socket.emit('nsList', nsData);
});

namespaces.forEach((ns) => {
	io.of(ns.endpoint).on('connect', (nsSocket) => {
		nsSocket.emit('nsRoomLoad', namespaces[0].rooms);
	});
});
