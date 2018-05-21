/**********************************\
Packages
\**********************************/
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var $ = require('jquery');
/**********************************\
Route Variables
\**********************************/
var index = require('./routes/index');
var users = require('./routes/users');
var register = require('./routes/register');
var aboutus = require('./routes/aboutus');
var homepage = require('./routes/homepage');
var logout = require('./routes/logout');
var createpool = require('./routes/createpool');
var membersearch = require('./routes/membersearch');
var poolsearch = require('./routes/poolsearch');
/**********************************\
Express, Views and Package Usage
\**********************************/
var app = express();

// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(favicon(path.join(__dirname, 'public', 'images/favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
/**********************************\
Session/Cookies
\**********************************/
app.use(session({
	genid: function(req){
		var gen = "";
          var chars = "ABCDEFGHIJKLMNOP1234567890abcdefghijklmnopqrstuvwxyz,<>/?:;{}[]|+=_-)(*&^%$#@!";
          while (gen.length < 64) {
            gen += chars.charAt(Math.floor(Math.random() * chars.length));
          }
          return gen;
	},
	path: '/',
	secret: 'Is_this_the_real_lifeIs_this_just_fantasyCaught_in_a_landslideNo_escape_from_realityOpen_your_eyesLook_up_to_the_skies_and_seeIm_just_a_poor_boy_I_need_no_sympathyBecause_Im_easy_come_easy_goLittle_high_little_lowAny_way_the_wind_blows_doesnt_really_matter_to_me_to_meMama_just_killed_a_manPut_a_gun_against_his_headPulled_my_trigger_now_hes_deadMama_life_had_just_begunBut_now_Ive_gone_and_thrown_it_all_awayMama_oohDidnt_mean_to_make_you_cryIf_Im_not_back_again_this_time_tomorrowCarry_on_carry_on_as_if_nothing_really_mattersToo_late_my_time_has_comeSends_shivers_down_my_spineBodys_aching_all_the_timeGoodbye_everybody_Ive_got_to_goGotta_leave_you_all_behind_and_face_the_truthMama_ooh_any_way_the_wind_blowsI_dont_wanna_dieI_sometimes_wish_Id_never_been_born_at_allI_see_a_little_silhouetto_of_a_manScaramouche_Scaramouche_will_you_do_the_FandangoThunderbolt_and_lightningVery_very_frightening_meGalileo_GalileoGalileo_GalileoGalileo_FigaroMagnificoooooIm_just_a_poor_boy_nobody_loves_meHes_just_a_poor_boy_from_a_poor_familySpare_him_his_life_from_this_monstrosityEasy_come_easy_go_will_you_let_me_goBismillah__No_we_will_not_let_you_go_Let_him_go_Bismillah__We_will_not_let_you_go_Let_him_go_Bismillah__We_will_not_let_you_go_Let_me_go_Will_not_let_you_go_Let_me_go_Never_let_you_go_Never_never_never_never_let_me_goOh_oh_oh_ohNo_no_no_no_no_no_noOh_mama_mia_mama_mia_Mama_mia_let_me_goBeelzebub_has_a_devil_put_aside_for_me_for_me_for_meSo_you_think_you_can_stone_me_and_spit_in_my_eyeSo_you_think_you_can_love_me_and_leave_me_to_dieOh_baby_cant_do_this_to_me_babyJust_gotta_get_out_just_gotta_get_right_outta_hereOoooh_ooh_yeah_ooh_yeahNothing_really_mattersAnyone_can_seeNothing_really_mattersNothing_really_matters_to_meAny_way_the_wind_blows',
	resave: false,
	saveUninitialized: true,
	cookie: {secure: false, maxAge: 30 * 60 * 1000 }
}));

/**********************************\
Route Usage and View pairing
\**********************************/
app.use('/', index);
app.use('/users', users);
app.use('/register', register);
app.use('/aboutus', aboutus);
app.use('/homepage', homepage);
app.use('/logout', logout);
app.use('/createpool', createpool);
app.use('/membersearch', membersearch);
app.use('/poolsearch', poolsearch);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
