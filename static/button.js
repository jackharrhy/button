var
	socket = io({ path: '/button/socket.io' }),

	buttonCount,
	sessionCount = 0,
	userCount = 0;

function click() {
	socket.emit('click');
	console.log('click');
}

function update(interger, domElement) {
	document.getElementById(domElement).innerHTML = String(interger);
}

socket.on('new socket', function(count) {
	buttonCount = count;

	update(buttonCount, 'counter');
	update(sessionCount, 'session');
	update(userCount, 'user');
});

socket.on('click', function(count) {
	buttonCount = count;
	sessionCount++;

	update(buttonCount, 'counter');
	update(sessionCount, 'session');
});

