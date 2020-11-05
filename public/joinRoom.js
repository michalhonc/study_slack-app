function joinRoom(roomName) {
	nsSocket.emit('joinRoom', roomName, (newNumberOfMembers) => {

		document.querySelector('.curr-room-num-users').innerHTML = `${newNumberOfMembers} <span class="glyphicon glyphicon-user"></span>`;
	});

	nsSocket.on('historyCatchUp', (history) => {
		const messagesUl = document.querySelector('#messages');
		messagesUl.innerHTML = '';
		history.forEach((msg) => {
			const newMsg = buildHTML(msg);
			const currentMessages = messagesUl.innerHTML;
			messagesUl.innerHTML = currentMessages + newMsg;
		});

		messagesUl.scrollTo(0, messagesUl.scrollHeight);
	});

	nsSocket.on('updateMembers', (numMembers) => {
		document.querySelector('.curr-room-num-users').innerHTML = `${numMembers} <span class="glyphicon glyphicon-user"></span>`;
		document.querySelector('.curr-room-text').innerText = roomName;
	});
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
