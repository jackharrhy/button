console.log('[0] Button started!');

var buttonCount;
var prevButtonCount;

var fs = require('fs');

var express = require('express');
var app = express();

app.set('view engine', 'jade');
app.get('/', function(req, res) {
	res.render('index');
});

app.use('/static', express.static(__dirname + '/static'));

fs.readFile('./count', 'utf8', function(err,data) {
	if(err) throw err;

	buttonCount = parseInt(data);
});

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

var io = require('socket.io').listen(app.listen(9191, function() {
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
