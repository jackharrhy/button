var
	socket = io(),
	
	userCount,
	buttonCount;

function click() {
	socket.emit('click');
	console.log('click');
}

socket.on('new socket', function(count) {
	buttonCount = count;

	document.getElementById('counter').innerHTML = String(buttonCount);
});

socket.on('click', function(count) {
	buttonCount = count;
	console.log(buttonCount);

	document.getElementById('counter').innerHTML = String(buttonCount);
});

