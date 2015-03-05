"use strict";

var mongodb = require("mongodb").MongoClient;

var express    = require("express");
var app        = express();
var bodyParser = require("body-parser");
var multer     = require('multer');

var crypto = require('crypto');

var dbUrl = "mongodb://localhost/test";

var md5 = function (s) {
	return crypto.createHash('md5').update(s).digest('hex');
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer());

app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');

    // Request methods you wish to allow
    // res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    // res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    // res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.post("/register", function(req, res) {
	console.log(req.body);

	mongodb.connect(dbUrl, function (err, db) {
		var users = db.collection("users");

		console.log(md5(req.body.password));

		users.insert(req.body, function (err, result) {
			res.send("Registered " + req.body.email);
		});


		db.close();
	});

});

app.listen(3000);





