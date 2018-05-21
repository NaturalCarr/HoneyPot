var express = require('express');
var router = express.Router();
var dateTime = require('node-datetime');
const sqlite3 = require('sqlite3').verbose();

/* GET users listing. */
router.get('/', function(req, res, next) {
	var dt = dateTime.create();
	var formatted = dt.format('Y-m-d');
	console.log(formatted)
	if (req.session.username) {

		res.render('createpool', {
			today: formatted
		});
	} else {
		res.redirect('/');
	}
});

router.post('/', function(req, res, next) {
	var poolid = "";
	var poolname = req.body.poolname;
	var poolsize = req.body.poolsize;
	var poolvalue = req.body.poolvalue;
	var payrounds = req.body.payrounds;
	var begindate = req.body.begindate;
	var ratingreq = req.body.ratingrequirement;
	var poolstage = "P_IN"
	var payinamount = (poolvalue / payrounds);

	check_Pool_Gen();

	function check_Pool_Gen() {
		pidexists = true;
		var pidretr = [];
		var iter = 0;
		let honeypot = new sqlite3.Database('./database/HoneyPot.db', (err) => {
			if (err) {
				return console.error(err.message);
			}
			console.log('Database Connection Successfully Established - Checking PoolID');
		});

		honeypot.serialize(() => {
			honeypot.each("SELECT PoolID as pid from Pool", function(err, row) {
				if (err) {
					return console.error(err.message);
				}
				pidretr[iter] = row.pid.toString();
				iter++;
			});
		}); //end of serialize

		honeypot.close((err) => {
			if (err) {
				return console.error(err.message);
			}
			while (pidexists == true) {
				poolid = pool_id_generator();
				for (i = 0; i < pidretr.length; i++) {
					if (pidretr[i].toString() == poolid.toString()) {
						console.log("Generated Pool ID " + poolid + " exists");
						pidexists = true;
					} // end of if
					else {
						pidexists = false;
					} // end of else
				} // end of for 
			} // end of while
			console.log("Pool ID Generated: " + poolid);
			if (poolname == null || poolname === '0' || poolname == [] || poolname == "" || poolname === null) {
				poolname = poolid;
			}
			if (ratingreq == "0.0" || ratingreq == "0" || ratingreq == 0 || ratingreq == null){
				ratingreq = "N/A"
			}
			create_pool(poolid);
		});
	}

	function create_pool(poolid) {

		let honeypot = new sqlite3.Database('./database/HoneyPot.db', (err) => {
			if (err) {
				return console.error(err.message);
			}
			console.log('Database Connection Successfully Established');
		});

		honeypot.serialize(() => {
			honeypot.run("INSERT INTO Pool (PoolID, Pool_Name, REC_MIN, Rate_Req, REC_Dead, Pool_Stage, Pay_Out_Amount, Pay_Out_Rounds, Pay_In_Start, Pool_Creator) VALUES ('" + poolid +"', '" + poolname +"', '" + poolsize + "', '" + ratingreq + "', '" + begindate + "', '" + poolstage + "', '" + poolvalue + "', '" + payrounds +"', '" + begindate + "', '" + req.session.username + "')");
			honeypot.run("INSERT INTO POOLMEMBERS (PoolID, Username, Pay_Ins_Left, Pay_In_Amount, QPOS, POUTD) VALUES ('" + poolid +"', '" + req.session.username + "', '" + payrounds + "', '" + payinamount + "', '0', '" + begindate + "')");
		});

		honeypot.close((err) => {
			if (err) {
				return console.error(err.message);
			}
			console.log("=======================");
			console.log("Pool Created");
			console.log("ID: " + poolid);
			console.log("Name: " + poolname);
			console.log("Creator: " + req.session.username);
			console.log("Value: " + poolvalue);
			console.log("Size: " + poolsize);
			console.log("Rounds: " + payrounds);
			console.log("Pay-Round Amount: " + payinamount);
			console.log("Start Date: " + begindate);
			console.log ("Ratign Req: " + ratingreq);
			console.log("=======================");
			res.render('pcreate_redirect', {
				title: "Pool Creation - Redirecting"
			});
		});

	}
});
module.exports = router;

function pool_id_generator() {
	var gen = "";
	var chars = "ABCDEFGHIJKLMNOP1234567890";
	while (gen.length < 24) {
		gen += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return gen;
}