var express = require('express');
var router = express.Router();
const sqlite3 = require('sqlite3').verbose();

/* GET home page. */
router.get('/', function(req, res, next) {
	if (req.session.username){
		var poolid = []; // Poolid
		var poolname = []; // Pool Name
		var memcount = []; // Pool Current Member Count
		var ratingreq = []; // Pool rating requirements
		//var recdead = []; // recruitment deadline
		var minmem = []; // Minimum Members Required
		var mode = []; // Current Pool Mode (Payin/Payout)
		var poa = []; // Payout Amount
		var por = []; // Payouts Remainig
		var pia = []; // Pool Pay-In Amount
		var pir = []; // Pol Pay-ins Remaining.
		var systrate = "";
		var userrate = "";
		var totalpay = [""];
		var seg = [""];
		var walletid = "";
		var walletvalue = "";
		data_pull_pool();
		req.session.lastpage = "/homepage";
	}
	else {
		res.redirect('/');
	}

	function data_pull_pool(){
	var iter = 0;

	  let honeypot = new sqlite3.Database('./database/HoneyPot.db', (err) => {
    if (err)
    {
      return console.error(err.message);
    }
    console.log('Database Connection Successfully Established');
  });

  honeypot.serialize(() => {
    honeypot.each("SELECT USERS.systrate as sysr, USERS.userate as userr, Pool.PoolID as pid, pool.RATE_REQ as rreq, pool.REC_DEAD as recd, pool.REC_MIN as min, pool.POOL_STAGE as mode, pool.PAY_OUT_AMOUNT as poa, pool. PAY_OUT_ROUNDS as por, pool.PAY_IN_AMOUNT as pia, pool.PAY_IN_ROUNDS as pir, pool.POOL_CREATOR as origin, pool.POOL_NAME as pname, count(DISTINCT poolmembers.username) as memcount, Wallet.WalletID as wid, wallet.value_usd as value FROM POOL, POOLMEMBERS, USERS, Wallet WHERE Pool.PoolID = PoolMembers.PoolID AND Wallet.WalletID = Users.WalletID AND USERS.USERNAME = Poolmembers.username AND Poolmembers.username ='" + req.session.username +"' GROUP BY poolmembers.poolid;", (err, row) => {
      if (err) { console.error(err.message);}
      poolid[iter] = row.pid;
      poolname[iter]= row.pname;
      memcount[iter]= row.memcount;
      mode[iter]= row.mode;
      poa[iter]= row.poa;
      por[iter]= row.por;
      pia[iter]= row.pia;
      pir[iter]= row.pir;
      totalpay[iter]= row.poa;
      minmem[iter]= row.min;
      ratingreq[iter]= row.rreq;
      systrate = row.sysr;
      userrate = row.userr;
      walletid = row.wid;
      walletvalue = row.value;
      seg[iter]= (row.poa / row.por);
      //console.log(row.id + "\t" + row.name);
      console.log(poolname[iter]);
      iter++;
    });

  });
  honeypot.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    		res.render('homepage', { 
			title: 'HoneyPot - Home',
			pool_id: poolid,
			pool_name: poolname,
			member_count: memcount,
			rating: ratingreq,
			minimum: minmem,
			mode: mode,
			payout_a: poa,
			payout_r: por,
			payin_a: pia,
			payin_r: pir,
			pool_total_value: totalpay,
			username: req.session.username,
			usrrate: userrate,
			sysrate: systrate,
			segp: seg,
			walletid: walletid,
			val: walletvalue
		});
    console.log('Close The Database Connection');
  });

}
  
});// end of get

router.post('/', function(req, res, next) {
});

module.exports = router;