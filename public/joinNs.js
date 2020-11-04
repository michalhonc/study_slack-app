function joinNs(endpoint) {
	const nsSocket = io(`http://localhost:9000${endpoint}`);

	nsSocket.on('nsRoomLoad', (nsRooms) => {
		let roomList = document.querySelector('.room-list');
		roomList.innerHTML = '';

		nsRooms.forEach((room) => {
			let glyph = room.privateRoom ? 'lock' : 'globe';
			roomList.innerHTML += `<li class="room"><span class="glyphicon glyphicon-${glyph}"></span>${room.roomTitle}</li>`;

			Array.from(document.getElementsByClassName('room')).forEach((el) => {
				el.addEventListener('click', (e) => {


				});
			});
		});
	});

	nsSocket.on('messageToClients', (msg) => {
		document.querySelector('#messages').innerHTML += `<li>${msg.text}</li>`;
	});

	document.querySelector('.message-form').addEventListener('submit',(event)=>{
		event.preventDefault();
		const newMessage = document.querySelector('#user-message').value;
		socket.emit('newMessageToServer',{text: newMessage});
	});
}
