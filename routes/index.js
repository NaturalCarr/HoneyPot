var express = require('express');
var router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const jquery = require('jquery');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'HoneyPot'
  });
});



router.post('/', function(req, res, next) {
  var temp = "";
  var usn = req.body.username; //this will hold the username the user entered
  var usp = req.body.password; // this will hold the password the user entered

  login();

  function login() {
    /*****************************************\
    Make Database Connection
    \*****************************************/
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
      honeypot.each("SELECT password as pswd FROM USERS where username='" + usn + "'", function(err, row) {
        if (err) {
          return console.err(err.message);
        }
        temp = row.pswd;
      });
    });


    /*****************************************\
    Process and Do Something On Close of Connection
    \*****************************************/
    honeypot.close((err) => {
      if (err) {
        return console.error(err.message);
      }
      if (temp == null || temp === '0' || temp == [] || temp == "" || temp === null) {
        console.log('Failed Login Attempt | Username: ' + usn + ' Password: ' + usp);
        res.status(401);
        res.render('invalid', {
          message: 'Invalid Username and/or Password, Login Attempt Logged'
        });
      } else if (usp == temp) { //This is the success condition
        res.render('homepage', {
          title: 'HoneyPot - Save For Tomorrow'
        });
      } else {
        console.log('Failed Login Attempt | Username: ' + usn + ' Password: ' + usp);
        res.status(401);
        res.render('invalid', {
          message: 'Invalid Username and/or Password, Login Attempt Logged'
        });
      }
      console.log('Close The Database Connection');
    });
  }
  
});

module.exports = router;