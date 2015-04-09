	// Button //

var
	// VARIBLES
	buttonCount,
	prevButtonCount,

	// LIBARIES
	fs = require('fs'),								// File System

	express = require('express'),			 // Express.js
	app = express();

// Set buttonCount to the contents of './count'
fs.readFile('./count', 'utf8', function(err,data) {
	if(err) throw err;

	buttonCount = parseInt(data);
});

/// SETUP EXPRESS
app.set('view engine', 'jade');			// Allow Jade to control rendering

app.get('/', function(req, res) {
	res.render('index');							// Return 'index.jade' when requesting '/'
});

// Make the folder './static' accsessable on /static
app.use('/static', express.static(__dirname + '/static'));

/// LOGGING CLICKS
function logClicks() {
	if(buttonCount && buttonCount !== prevButtonCount) {
		fs.writeFile('count', String(buttonCount), function(err) {
			if(err) throw err;
			console.log('[/] Wrote "' + String(buttonCount) + '" to "./count"');
			prevButtonCount = buttonCount;
		});
	}
	setTimeout(logClicks, 60000);
}
setTimeout(logClicks, 5000);

/// SOCKET.IO + SERVER INITIATION

var io = require('socket.io').listen(app.listen(3000, function() {
	console.log('[%] Listening @ localhost:3000');
}));

io.sockets.on('connection', function(socket) {
	console.log('[=] Socket "' + socket.handshake.headers.host + '" connected');

	io.emit('new socket', buttonCount);

	socket.on('click', function() {
		buttonCount++;
		console.log('[@] ' + String(buttonCount) + ' Click(s)!');
		io.emit('click', buttonCount);
	});
});

