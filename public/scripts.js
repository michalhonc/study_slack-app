const username = prompt('What is your username');
const socket = io('http://localhost:9000', {
	query: {
		username,
	}
});
let nsSocket = '';

socket.on('nsList', (nsData) => {
	const namespacesDiv = document.querySelector('.namespaces');
	namespacesDiv.innerHTML = '';

	nsData.forEach((ns) => {
		namespacesDiv.innerHTML += `<div class="namespace" data-ns="${ns.endpoint}"><img src="${ns.img}" /></div>`;
	});

	Array.from(document.getElementsByClassName('namespace')).forEach((el) => {
		el.addEventListener('click', (e) => {
			const nsEndpoint = el.getAttribute('data-ns');
			joinNs(nsEndpoint);
		});
	});

	joinNs('/wiki');
});
