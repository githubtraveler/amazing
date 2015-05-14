"use strict";

var path   = require("path");
var crypto = require("crypto");

var config = require("./config/server-config.js");

var mongodb = require("mongodb").MongoClient;
var dbUrl   = config.dbUrl;

var express    = require("express");
var app        = express();
var bodyParser = require("body-parser");
var multer     = require("multer");

var nodemailer    = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");
var mailConfig    = require("./config/mail-config.js");
var transporter   = nodemailer.createTransport(smtpTransport(mailConfig));

var paypal       = require("paypal-rest-sdk");
var paypalConfig = require("./config/paypal-config.js");

var md5 = function (s) {
	return crypto.createHash("md5").update(s).digest("hex");
};

var sessions   = {};
var resetCodes = {};
var inactive   = {};

var prices = {
	"app1": "5.00"
};

var generateSessionId = function () {
	return md5(Math.random().toString());
};

var saveAndSendNewSessionId = function (req, res) {
	var sessionKey = generateSessionId();

	sessions[req.body.email] = sessionKey;
	res.status(200).send(sessionKey);
};

var getRandomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer());

// app.use(function (req, res, next) {
    // Website you wish to allow to connect
    // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');

    // Request methods you wish to allow
    // res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    // res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    // res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    // next();
// });

paypal.configure(paypalConfig.api);


app.use(express.static(path.resolve(__dirname + "/" + config.staticContentPath)));


mongodb.connect(dbUrl, function (err, db) {
	db.collection("users", {"strict":true}, function (err, collection) {
		if (!collection) {
			console.log("'users' collection does not exist");

    		db.createCollection("users", function () {
    			console.log("created 'users' collection");
    			db.close();
    		});
		} else {
			console.log("using existing 'users' collection");
    		db.close();
		}
  	});
});

app.post("/activate", function (req, res) {
	var email = req.body.email;
	var code  = req.body.code;

	if (inactive[email] && (inactive[email].code === code)) {
		mongodb.connect(dbUrl, function (err, db) {
			var users = db.collection("users");

			delete inactive[email].code;

			users.insert(inactive[email], function (err, result) {
				db.close();
				saveAndSendNewSessionId(req, res);
				delete inactive[email];
			});
		});
	}
});

app.post("/register", function (req, res) {
		mongodb.connect(dbUrl, function (err, db) {
			var email = req.body.email;
			var users = db.collection("users");

			users.findOne({ "email": email }, function (err, result) {
				var code;

				if (!result) {
					code = getRandomInt(1000, 9999).toString();

					transporter.sendMail({
						from   : "registrationtesting@rd-arts.com",
						to     : email,
						subject: "activation code",
						text   : code
					}, function(error, info){
					    if(error){
					        console.log(error);
					    } else {
					    	inactive[req.body.email] = {
					    		"code"        : code,
					    		"name"        : req.body.name,
					    		"organization": req.body.organization,
					    		"email"       : email,
					    		"password"    : md5(req.body.password)
					    	};

					    	res.status(200).send("actvation code sent");
					    	// Object.keys(info).forEach(function (k, i) {
					    	// 	console.log(k, info[k]);
					    	// });
					    }
					});
				} else {
					db.close();
					res.send("Already exists " + req.body.email);
				}
			});
		});
});

// app.post("/register", function (req, res) {
// 	mongodb.connect(dbUrl, function (err, db) {
// 		var users = db.collection("users");

// 		users.findOne({ "email": req.body.email }, function (err, result) {
// 			if (!result) {
// 				users.insert({
// 					"name"        : req.body.name,
// 					"organization": req.body.organization,
// 					"email"       : req.body.email,
// 					"password"    : md5(req.body.password)
// 				}, function (err, result) {
// 					db.close();
// 					saveAndSendNewSessionId(req, res);
// 				});
// 			} else {
// 				db.close();
// 				res.send("Already exists " + req.body.email);
// 			}
// 		});
// 	});
// });

app.post("/reset-password", function (req, res) {
	mongodb.connect(dbUrl, function (err, db) {
		var users = db.collection("users");

		var email    = req.body.email;
		var code     = req.body.code;
		var password = md5(req.body.password);

		if (resetCodes[email] === code) {
			console.log("valid code");
			users.update(
				{ "email": email },
				{ "$set": {"password": password }},
				function (err, result) {
					if (result) {
						console.log("password updated", password);
						res.status(200).send("updated");
					}

					db.close();
				}
			);
		} else {
			db.close();
		}
	});
});

app.post("/reset-request", function (req, res) {
	mongodb.connect(dbUrl, function (err, db) {
		var users = db.collection("users");
		var email = req.body.email;

		users.findOne({ "email": email }, function (err, result) {
			var code = getRandomInt(1000, 9999).toString();

			if (result) {
				transporter.sendMail({
					from   : "registrationtesting@rd-arts.com",
					to     : email,
					subject: "password reset code",
					text   : code
				}, function(error, info){
				    if(error){
				        console.log(error);
				    } else {
				    	resetCodes[email] = code;

				    	Object.keys(info).forEach(function (k, i) {
				    		console.log(k, info[k]);
				    	});
				    }
				});

				console.log("email found");
				res.status(200).send("Approved");
			} else {
				console.log("fail", email);
			}

			db.close();
		});
	});
});

app.post("/login", function (req, res) {
	mongodb.connect(dbUrl, function (err, db) {
		var users = db.collection("users");

		users.findOne({ "email": req.body.email }, function (err, result) {
			if (!result) {
				res.status(400).send("Account not found");
			} else if (md5(req.body.password) === result.password) {
				saveAndSendNewSessionId(req, res);
			} else {
				res.status(400).send("Access denied. Wrong password.");
			}

			db.close();
		});
	});
});

app.get("/download/:email/:session/:file", function (req, res) {
	var params = req.params;

	var email     = params.email;
	var sessionId = params.session;
	var file      = params.file;

	if (sessionId === sessions[email]) {
		res.sendFile(__dirname + "/download/" + file);
	} else {
		res.sendStatus(403);
	}
});

app.post("/purchased", function (req, res) {
	mongodb.connect(dbUrl, function (err, db) {
		var users = db.collection("users");

		users.findOne({ "email": req.body.email }, function (err, result) {
			var purchases = result.purchases;

			var found = purchases && purchases.some(function (purchase) {
				return (purchase.item === req.body.app);
			});

			res.status(200).send(found ? "true" : "false");
		});
	});
});

app.post("/purchase", function (req, res) {
	var payment = {
		"intent": "sale",
		"payer": {
			"payment_method"     : "credit_card",
			"funding_instruments": [{ "credit_card": req.body.cc }]
		},
		"transactions": [{
			"amount": {
				"total"   : prices[req.body.item],
				"currency": "USD"
			},
			"description": "My awesome payment"
		}]
	};

	paypal.payment.create(payment, function (error, payment) {
		if (!error) {
			if (sessions[payment.email] === payment.session) {
				mongodb.connect(dbUrl, function (err, db) {
					var users = db.collection("users");

					users.update(
						{ "email": req.body.email },
						{ "$addToSet": {
							"purchases": {
								"item"     : req.body.item,
								"paymentId": payment.id
							}
						}}, function (err, result) {

							if (result) {
							} else {
							}

							db.close();
						}
					);
				});


				res.status(payment.httpStatusCode).send(payment.state);
			} else {
				res.sendStatus(403);
			}
		} else {
			res.status(error.httpStatusCode).send(error.message);
		}
	});
});


app.listen(config.port || 3000);

