"use strict";

var mongodb = require("mongodb").MongoClient;

var express    = require("express");
var app        = express();
var bodyParser = require("body-parser");
var multer     = require('multer');

var nodemailer  = require('nodemailer');
var transporter = nodemailer.createTransport();

var crypto = require('crypto');

var dbUrl = "mongodb://localhost/test";

var md5 = function (s) {
	return crypto.createHash('md5').update(s).digest('hex');
};

var sessions = {};

// transporter.sendMail({
// 	from   : 'oleg.gunkin@gmail.com',
// 	to     : 'oleg.gunkin@gmail.com',
// 	subject: 'hello',
// 	text   : 'hello world!'
// }, function(error, info){
//     if(error){
//         console.log(error);
//     }else{
//         console.log('Message sent: ' + info.response);
//     }
// });

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

		users.findOne({ "email": req.body.email }, function (err, result) {
			if (!result) {
				users.insert({
					"email"   : req.body.email,
					"password": md5(req.body.password)
				}, function (err, result) {
					res.status(200).send("Registered " + req.body.email);
					db.close();
				});
			} else {
				res.send("Already exists " + req.body.email);
				db.close();
			}
		});

	});

});

app.post("/login", function (req, res) {
	mongodb.connect(dbUrl, function (err, db) {
		var users = db.collection("users");

		users.findOne({ "email": req.body.email }, function (err, result) {
			var sessionKey;

			if (!result) {
				res.status(400).send("Account not found");
			} else if (md5(req.body.password) === result.password) {
				sessionKey = md5(Math.random().toString());
				sessions[req.body.email] = sessionKey;
				res.status(200).send("Access granted. Session id is " + sessionKey);
			} else {
				res.status(400).send("Access denied. Wrong password.");
			}


			db.close();
		});
	});
});

app.listen(3000);
