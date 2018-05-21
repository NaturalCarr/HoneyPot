var express = require('express');
var router = express.Router();
const sqlite3 = require('sqlite3').verbose();

/* GET users listing. */
router.get('/', function(req, res, next) {
	if (req.session.username) {
		res.render('membersearch', {
			memberuname: "",
			memberemail: "",
			memberid: "",
			memberfname: "",
			memberlname: "",
			emailmember: ""
		});
	} else {
		res.status("412");
		res.redirect('/homepage');
	}
});

router.post('/', function(req, res, next) {

	var selection = req.body.sel;
	var username = "";
	var firstn = "";
	var lastn = "";
	var email = "";
	var id = "";

	if (req.body.sel == "usn") {
		let honeypot = new sqlite3.Database('./database/HoneyPot.db', (err) => {
			if (err) {
				return console.error(err.message);
			}
			console.log('Database Connection Successfully Established');
		});

		/*****************************************\
		Acccess Database Information
		\*****************************************/
		honeypot.serialize(() => {
			honeypot.each("SELECT Firstname as ufn, lastname as uln, username as un, email as umeml, walletid as uwid FROM USERS where username='" + req.body.username + "'", function(err, row) {
				if (err) {
					return console.err(err.message);
				}
				firstn = row.ufn;
				lastn = row.uln;
				email = row.umeml;
				id = row.uwid;
				username = row.un;
			});
			/*****************************************\
			Process and Do Something On Close of Connection
			\*****************************************/
			honeypot.close((err) => {
				if (err) {
					return console.error(err.message);
				}
				res.render('membersearch', {
					memberuname: username,
					memberfname: firstn,
					memberlname: lastn,
					memberemail: email,
					emailmember: "mailto:" + email,
					memberid: id
				});
				console.log('Close The Database Connection');
			});
		});
	} else if (req.body.sel == "uem") {

		let honeypot = new sqlite3.Database('./database/HoneyPot.db', (err) => {
			if (err) {
				return console.error(err.message);
			}
			console.log('Database Connection Successfully Established');
		});

		/*****************************************\
		Acccess Database Information
		\*****************************************/
		honeypot.serialize(() => {
			honeypot.each("SELECT Firstname as ufn, lastname as uln, username as un, email as umeml, walletid as uwid FROM USERS where Email='" + req.body.email + "'", function(err, row) {
				if (err) {
					return console.err(err.message);
				}
				firstn = row.ufn;
				lastn = row.uln;
				email = row.umeml;
				id = row.uwid;
				username = row.un;
			});


			/*****************************************\
			Process and Do Something On Close of Connection
			\*****************************************/
			honeypot.close((err) => {
				if (err) {
					return console.error(err.message);
				}
				res.render('membersearch', {
					memberuname: username,
					memberfname: firstn,
					memberlname: lastn,
					memberemail: email,
					emailmember: "mailto:" + email,
					memberid: id
				});
				console.log('Close The Database Connection');
			});
		});

	} else if (req.body.sel == "uip") {


		let honeypot = new sqlite3.Database('./database/HoneyPot.db', (err) => {
			if (err) {
				return console.error(err.message);
			}
			console.log('Database Connection Successfully Established');
		});

		/*****************************************\
		Acccess Database Information
		\*****************************************/
		honeypot.serialize(() => {
			honeypot.each("SELECT Firstname as ufn, lastname as uln, username as un, email as umeml, walletid as uwid FROM USERS where walletid='" + req.body.ID + "'", function(err, row) {
				if (err) {
					return console.err(err.message);
				}
				firstn = row.ufn;
				lastn = row.uln;
				email = row.umeml;
				id = row.uwid;
				username = row.un;
				console.log(username);
			});


			/*****************************************\
			Process and Do Something On Close of Connection
			\*****************************************/
			honeypot.close((err) => {
				if (err) {
					return console.error(err.message);
				}
				res.render('membersearch', {
					memberuname: username,
					memberfname: firstn,
					memberlname: lastn,
					memberemail: email,
					emailmember: "mailto:" + email,
					memberid: id
				});
				console.log('Close The Database Connection');
			});

		});

	} else {
		res.status(400);
		res.send("Error - Invalid Selector");
	}

});
module.exports = router;