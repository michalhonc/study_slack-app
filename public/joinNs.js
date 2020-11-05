function joinNs(endpoint) {
	if (nsSocket) {
		nsSocket.close();
		document.querySelector('#user-input').removeEventListener('submit', formSubmit);
	}

	nsSocket = io(`http://localhost:9000${endpoint}`);

	nsSocket.on('nsRoomLoad', (nsRooms) => {
		let roomList = document.querySelector('.room-list');
		roomList.innerHTML = '';

		nsRooms.forEach((room) => {
			let glyph = room.privateRoom ? 'lock' : 'globe';
			roomList.innerHTML += `<li class="room"><span class="glyphicon glyphicon-${glyph}"></span>${room.roomTitle}</li>`;

			Array.from(document.getElementsByClassName('room')).forEach((el) => {
				el.addEventListener('click', (e) => {
					joinRoom(el.innerText);
				});
			});

		});
	});

	nsSocket.on('messageToClients', (msg) => {
		document.querySelector('#messages').innerHTML += buildHTML(msg);
	});

	document.querySelector('.message-form').addEventListener('submit', formSubmit);
}

function formSubmit(event) {
	event.preventDefault();
	const newMessage = document.querySelector('#user-message').value;
	nsSocket.emit('newMessageToServer',{text: newMessage});
}

function buildHTML(fullMsg) {
	return `
    <li>
        <div class="user-image">
            <img src="${fullMsg.avatar}" />
        </div>
        <div class="user-message">
            <div class="user-name-time">${fullMsg.username} <span>${fullMsg.time}</span></div>
            <div class="message-text">${fullMsg.text}</div>
        </div>
    </li>
  `;
}
