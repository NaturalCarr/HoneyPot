var express = require('express');
var router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const jquery = require('jquery');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('register', {
    title: 'HoneyPot - Register',
    swal: null
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
      var sweetalert = true;


      check_input(sweetalert, usn, usp, fnm, lsn, eml);

      //Check Input --> Check Username --> Check Email --> Generate Wallet ID <--> Check Against Existing --> Complete Registration 


      //================================================================================== Function Definitions ==================================================================================//
      function check_input(toggle, usn, usp, fnm, lsn, eml) {
        var invalid = false;
        //These if-statments can probably be shortened, but this typing should take a while and what else am I going to do on a Friday night?

        if (!toggle) {
          if (usn == null || usn === '0' || usn == [] || usn == "" || usn === null) {
            invalid = true;
            res.render('invalid', {
              message: "Username cannot be empty",
              return: "/register"
            });
          } else if (usp == null || usp === '0' || usp == [] || usp == "" || usp === null) {
            res.status(401);
            res.render('invalid', {
              message: "Password cannot be empty",
              return: "/register"
            });
          } else if (fnm == null || fnm === '0' || fnm == [] || fnm == "" || fnm === null) {
            res.status(401);
            res.render('invalid', {
              message: "Firstname cannot be empty",
              return: "/register"
            });
          } else if (lsn == null || lsn === '0' || lsn == [] || lsn == "" || lsn === null) {
            res.status(401);
            res.render('invalid', {
              message: "Lastname cannot be empty",
              return: "/register"
            });
          } else if (eml == null || eml === '0' || eml == [] || eml == "" || eml === null) {
            res.status(401);
            res.render('invalid', {
              message: "Email cannot be empty",
              return: "/register"
            });
          } else if (usn == usp) {
            res.status(401);
            res.render('invalid', {
              message: "Password and Username cannot be the same",
              return: "/register"
            });
          } else if (usp == fnm || usp == lsn || usp == fnm + lsn || usp == lsn + fnm) {
            res.status(401);
            res.render('invalid', {
              message: "Password cannot be your name",
              return: "/register"
            });
          } else {
            check_username_existence();
          }
        } else {
          var message = "";
          if (usn == null || usn === '0' || usn == [] || usn == "" || usn === null) {
            invalid = true;
            message += "Username cannot be blank\\n";
          }
          if (usp == null || usp === '0' || usp == [] || usp == "" || usp === null) {
            invalid = true;
            message += "Password cannot be blank\\n";
          }
          if (fnm == null || fnm === '0' || fnm == [] || fnm == "" || fnm === null) {
            invalid = true;
            message += "First name cannot be blank\\n";
          }
          if (lsn == null || lsn === '0' || lsn == [] || lsn == "" || lsn === null) {
            invalid = true;
            message += "Last name cannot be blank\\n";
          }
          if (eml == null || eml === '0' || eml == [] || eml == "" || eml === null) {
            invalid = true;
            message += "Email cannot be blank\\n";
          }
          if (usn == usp) {
            invalid = true;
            message += "Password cannot be username\\n";
          }
          if (usp == fnm || usp == lsn || usp == fnm + lsn || usp == lsn + fnm) {
            invalid = true;
            message += "Password cannot be name\\n";
          }
          if (!invalid) {
            check_username_existence();
          } else {
            res.render('register', {
              swal: 'swal(\'Invalid Input: \',"' + message + '",\'error\');',
              usern: usn,
              pass: usp,
              email: eml,
              firstn: fnm,
              lastn: lsn
            });
          }
        }

      }

      function check_username_existence() {
        temp = null;
        let honeypot = new sqlite3.Database('./database/HoneyPot.db', (err) => {
          if (err) {
            return console.error(err.message);
          }
          console.log('Database Connection Successfully Established - Checking USername');
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
            check_email_existence();
          } else {
            console.log("The User " + temp + " is in use, registration terminated");
            res.status(401);
            res.render('register', {
              swal: 'swal(\'Credential Taken\',"Username is taken",\'error\');',
              usern: null,
              pass: usp,
              email: eml,
              firstn: fnm,
              lastn: lsn
            });
          }
        });
}
        function check_email_existence() {
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
              gen_check_walletID();
            } else {
              console.log("The email address " + temp + " is in use, registration terminated");
              res.status(401);
            res.render('register', {
              swal: 'swal(\'Credential Taken\',"Email is taken",\'error\');',
              usern: null,
              pass: usp,
              email: eml,
              firstn: fnm,
              lastn: lsn
            });
            }
          });
        }

        function gen_check_walletID() {
          widexists = true;
          var iter = 0;
          let honeypot = new sqlite3.Database('./database/HoneyPot.db', (err) => {
            if (err) {
              return console.error(err.message);
            }
            console.log('Database Connection Successfully Established - Checking WalletID');
          });

          honeypot.serialize(() => {
            honeypot.each("SELECT WalletID as wid from Wallet", function(err, row) {
              if (err) {
                return console.error(err.message);
              }
              widretr[iter] = row.wid.toString();
              iter++;
            });
          }); //end of serialize

          honeypot.close((err) => {
            if (err) {
              return console.error(err.message);
            }
            while (widexists == true) {
              widgen = wallet_id_generator();
              for (i = 0; i < widretr.length; i++) {
                if (widretr[i].toString() == widgen.toString()) {
                  console.log("Generated Wallet ID " + widgen + " exists");
                } // end of if
                else {
                  widexists = false;
                } // end of else
              } // end of for 
            } // end of while
            console.log("WalletID Generated: " + widgen);
            completeregistration();
          });
        }

        function completeregistration() {
          temp = null;
          let honeypot = new sqlite3.Database('./database/HoneyPot.db', (err) => {
            if (err) {
              return console.error(err.message);
            }
            console.log('Database Connection Successfully Established - Completing Registration');
          });

          honeypot.serialize(() => {
            honeypot.run("INSERT INTO Users (Username, Password, Firstname, Lastname, Email, WalletID, Systrate, Userate) VALUES ('" + usn + "', '" + usp + "', '" + fnm + "', '" + lsn + "', '" + eml + "', '" + widgen + "', 'N/A', 'N/A')");
            honeypot.run("INSERT INTO Wallet (WalletID, Pref_Denom, Value_USD) VALUES ('" + widgen + "', 'USD', '0.00')");
          });

          honeypot.close((err) => {
            if (err) {
              return console.error(err.message);
            }
            console.log("=======================");
            console.log("User Successfully Registered");
            console.log("Username: " + usn);
            console.log("First Name: " + fnm);
            console.log("Last Name: " + lsn);
            console.log("Email Address:" + eml);
            console.log("WalletID: " + widgen);
            console.log("=======================");
            res.render('reg_redirect', {
              title: "Registration Successful - Redirecting"
            });
          });
        }

        function wallet_id_generator() {
          var gen = "";
          var chars = "ABCDEFGHIJKLMNOP1234567890";
          while (gen.length < 8) {
            gen += chars.charAt(Math.floor(Math.random() * chars.length));
          }
          return gen;
        }

        function render_invalid_page(message) {
          res.status(401);
          res.render('invalid', {
            message: message
          });
        }
      }); //end of router.post


    module.exports = router;