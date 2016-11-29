var express = require('express');
var static  = require('express-static');

var app = express();

app.use('/', express.static(__dirname + '/build'));
app.use('/assets', express.static(__dirname + '/build/assets'));
app.use('/src', express.static(__dirname + '/build/src'));
app.use('/vendor', express.static(__dirname + '/build/vendor'));
app.use('/client', express.static(__dirname + '/client/app'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));

// app.use('/css', express.static(__dirname + '/css'));
// app.use('/partials', express.static(__dirname + '/partials'));

app.get('/*', function(req, res) {
    // Just send the index.html for other files to support HTML5Mode
    res.sendFile('index.html', { root: __dirname + '/client' });
    // express.static(__dirname + '/build/index.html');
});

// app.use(static(__dirname + '/build'));
 
var server = app.listen(3000, function(){
    console.log('server is running at %s', server.address().port);
});