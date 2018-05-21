var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  if(req.session.username){
  	res.render('membersearch', {membername: "", memberemail: "", memberid: ""});
  }
  else {
  	res.status("412");
  	res.redirect('/');
  }
});

router.post('/', function(req, res, next){

});
module.exports = router;
