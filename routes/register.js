var express = require('express');
var router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const jquery = require('jquery');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('register',{title: 'HoneyPot - Register'});
});

router.post('/', function(req, res, next){
  var usn = req.body.username;
  var usp = req.body.password;
  var fnm = req.body.firstname;
  var lsn = req.body.lastname;
  var eml = req.body.email;
  var widcheck = true;
  var wid;
  var temp = null;

    /*****************************************\
  Make Database Connection
  \*****************************************/
  let honeypot = new sqlite3.Database('./database/HoneyPot.db', (err) =>{
    if (err){
      return console.error(err.message);
    }
    console.log('Database Connection Successfully Established');
  });

    /*****************************************\
  Acccess Database Information
  \*****************************************/
  honeypot.serialize(() => {
    temp = null;
      honeypot.each("SELECT Username as usnm FROM USERS where username='" + usn + "'", function(err, row) {
        if (err) { return console.err(err.message); }
        temp = row.usnm;
      });//each ending (top)
      if (temp == null || temp === '0' || temp == [] || temp == "" || temp === null){
        wid = wallet_id_generator();
        honeypot.each("SELECT walletId as wck from users WHERE walletid = '" + wid + "'", function(err, row){
            if (err) { return console.err(err.message); }
            temp = row.wck;
            console.log(temp + "tempvalue");

        });//honeypot.each ending (lower)
      }//if temp==null ending
  });//serialize ending

  }); //end of router.post
module.exports = router;
function wallet_id_generator(){
    return("abcdefg123456");
}