var connect = require('connect');

connect.createServer(connect.static(__dirname + "/src")).listen(8080);
