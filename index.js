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
    const username = nsSocket.handshake.query.username;
		nsSocket.emit('nsRoomLoad', ns.rooms);

		nsSocket.on('joinRoom', (roomToJoin) => {
			const roomToLeave = Object.keys(nsSocket.rooms)[1];
			nsSocket.leave(roomToLeave);
			updateUsersInRoom(ns, roomToLeave);

			nsSocket.join(roomToJoin);

			const nsRoom = ns.rooms.find((room) => {
				return room.roomTitle === roomToJoin;
			});

			nsSocket.emit('historyCatchUp', nsRoom.history);
			updateUsersInRoom(ns, roomToJoin);
		});

		nsSocket.on('newMessageToServer', (msg) => {
			const fullMsg = {
				text: msg.text,
				time: Date.now(),
				username: username,
				avatar: 'https://via.placeholder.com/30',
			};
			const roomTitle = Object.keys(nsSocket.rooms)[1];
			const nsRoom = ns.rooms.find((room) => {
				return room.roomTitle === roomTitle;
			});

			nsRoom.addMessage(fullMsg);

			io.of(ns.endpoint).to(roomTitle).emit('messageToClients', fullMsg);
		});
	});
});

function updateUsersInRoom(ns, roomToJoin) {
	io.of(ns.endpoint).in(roomToJoin).clients((_, clients) => {
		io.of(ns.endpoint).in(roomToJoin).emit('updateMembers', clients.length);
	});
}
