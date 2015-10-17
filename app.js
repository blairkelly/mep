var fs = require('fs');

// Get Env Vars
try {
    fs.readdirSync(__dirname + "/env").forEach(function (file) {
        if (/^\./.test(file)) return;
        if (!process.env[file]) {
            console.log("Setting: " + file);
            process.env[file] = fs.readFileSync(__dirname + "/env/" + file, "UTF-8").trim();
        }
    });
} catch (err) {
    console.log("No env folder.");
}

process.env.PORT = process.env.PORT || 3000;

var http = require('http');
var request = require('request');
var express = require('express');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require("body-parser");
var methodOverride = require('method-override');
var path = require('path');
var find = require('find');  //was specified for route, but not in registry.
var app = express();           // start Express framework
var io = app.io = require('socket.io')();

console.log("Building library...");
var lib = app.lib = {};
app.lib.mysql = require('./lib/mysql.js');

app.use(morgan('dev'));
app.enable('trust proxy');
app.use(cookieParser());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(express.static(path.join(__dirname + '/public')));

app.mainMiddleware = function mainMiddleware (req, res, next) {
    //possibly unneeded
    next();
}

var server = http.createServer(app); // start an HTTP server
var io = require('socket.io')(server);
server.listen(process.env.PORT);
console.log("Listening on ", process.env.PORT);

find.fileSync(/\.js$/, __dirname + '/routes').forEach(function (route_file) {
    console.log("Adding route file", route_file);
    require(route_file);
});

app.get('/hello', function (req, res, next) {
    res.status(200).send("Hello world.");
})