var express = require('express');
var router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const jquery = require('jquery');

/* GET home page. */
router.get('/', function(req, res, next) {
    if (req.session.username){
    res.render(req.session.lastpage);
  }
  else{
  res.render('index', {
    title: 'HoneyPot',
    swal: null
  });
}
  /*
  console.log(req.cookies);
  console.log("================");
  console.log(req.session);
  */
});



router.post('/', function(req, res, next) {

  var usn = req.body.username; //this will hold the username the user entered
  var usp = req.body.password; // this will hold the password the user entered

  if (usn == null || usn === '0' || usn == [] || usn == "" || usn === null || usp == null || usp === '0' || usp == [] || usp == "" || usp === null) {
    res.render('index', {
      swal: 'swal(\'Invalid Input\',"Fields cannot be empty",\'error\');'
    });
  } else {
    if (validate) {
      console.log("Successfull Login Attempt: " + usn + " validated");
      req.session.username = usn;
      req.session.lastpage = "homepage";
      req.session.save(function(err){
        //session save
        console.log(req.session.username + " | " + req.session.lastpage);
      });
      console.log(req.session.username);
      res.render('homepage');
    } else {
      console.log("Failed Login Attempt: Username[" + usn + "] | Password [" + usp + "]not validated");
      res.status(401);
      res.render('invalid', {
        message: 'Invalid Username and/or Password, Login Attempt Logged',
        return: "/"
      });
    }

  }



});

module.exports = router;


function validate(usn, usp) {
  var temp = "";
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
      return false;
    } else if (usp == temp) { //This is the success condition
      return true;
    } else {
      console.log('Failed Login Attempt | Username: ' + usn + ' Password: ' + usp);
      return false;
    }

    console.log('Close The Database Connection');
  });
}


/*


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
*/