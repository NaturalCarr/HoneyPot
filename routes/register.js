var express = require('express');
var router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const jquery = require('jquery');

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('register', {
        title: 'HoneyPot - Register'
    });
});

router.post('/', function(req, res, next) {
    var usn = req.body.username;
    var usp = req.body.password;
    var fnm = req.body.firstname;
    var lsn = req.body.lastname;
    var eml = req.body.email;
    var widexists = true;
    var widgen = null;
    var widretr = [];
    var temp = null;

    usernamecheck();
function usernamecheck(){
  temp = null;
    let honeypot = new sqlite3.Database('./database/HoneyPot.db', (err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Database Connection Successfully Established - Checking Email');
    });

    honeypot.serialize(() => {
        honeypot.each("SELECT username as usnm FROM USERS where username='" + usn + "'", function(err, row) {
            if (err) {
                return console.err(err.message);
            }
            temp = row.usnm;
        }); //each ending (top)
      });

    honeypot.close((err) => {
        if (err) {
            return console.error(err.message);
        }
        if (temp == null || temp === '0' || temp == [] || temp == "" || temp === null) {
          console.log("User " + usn + " does not exist, creating user");
          emailcheck();
        }
        else{
          console.log("The User " + temp + " is in use, registration terminated");
          res.status(401);
          res.send("The Username you entered is in use, please pick a different one");
        }
    });
  }
function emailcheck(){
  temp = null;
    let honeypot = new sqlite3.Database('./database/HoneyPot.db', (err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Database Connection Successfully Established - Checking Email');
    });

    honeypot.serialize(() => {
        honeypot.each("SELECT email as eml FROM USERS where Email='" + eml + "'", function(err, row) {
            if (err) {
                return console.err(err.message);
            }
            temp = row.eml;
        }); //each ending (top)
      });

    honeypot.close((err) => {
        if (err) {
            return console.error(err.message);
        }
        if (temp == null || temp === '0' || temp == [] || temp == "" || temp === null) {
          console.log("The email address " + eml + " does not exist, proceeding with registration");
          widcheck();
        }
        else{
          console.log("The email address " + temp + " is in use, registration terminated");
          res.status(401);
          res.send("The email address you entered is in use, please enter a different one");
        }
    });
  }
function widcheck(){
  widexists = true;
  var iter=0;
    let honeypot = new sqlite3.Database('./database/HoneyPot.db', (err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Database Connection Successfully Established - Checking WalletID');
    });

    honeypot.serialize(() => {
        honeypot.each("SELECT WalletID as wid from Wallet", function(err, row) {
            if (err) {
                return console.err(err.message);
            }
            widretr[iter] = row.wid.toString();
            iter++;
        }); //each ending (top)
      });

    honeypot.close((err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log(widretr.length);
        while (widexists == true){
          widgen = wallet_id_generator();
          for (i = 0; i < widretr.length; i++){
            if (widretr[i].toString() == widgen.toString()){
            }
            else {
              widexists = false;
              console.log("WalletID Generated: " + widgen);
            }
          }
        }
        completeregistration();
    });
  }
function completeregistration(){
  temp = null;
    let honeypot = new sqlite3.Database('./database/HoneyPot.db', (err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Database Connection Successfully Established - Completing Registration');
    });

    honeypot.serialize(() => {
      honeypot.run("INSERT INTO Users (Username, Password, Firstname, Lastname, Email, WalletID) VALUES ('" + usn + "', '" + usp + "', '" + fnm + "', '" + lsn + "', '" + eml + "', '" + widgen + "')");
      honeypot.run("INSERT INTO Wallet (WalletID, Pref_Denom, Value_USD) VALUES ('" + widgen + "', 'USD', '0.00')");
      });

    honeypot.close((err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log("Registration Completed, Redirecting");
        res.render('reg_redirect', {title: "Registration Successful - Redirecting"});
    });
  }
}); //end of router.post
module.exports = router;

function wallet_id_generator() {
    var gen = "";
    var chars = "ABCDEFGHIJKLMNOP1234567890";
    while (gen.length < 8) {
        gen += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return gen;
}