'use strict';

var morgan         = require('morgan'),
    bodyParser     = require('body-parser'),
    methodOverride = require('express-method-override'),
    less           = require('less-middleware'),
    session        = require('express-session'),
    RedisStore     = require('connect-redis')(session),
    security       = require('../lib/security'),
    passportConfig = require('../lib/passport/config'),
    passport       = require('passport'),
    flash          = require('connect-flash'),
    debug          = require('../lib/debug'),
    home           = require('../controllers/home'),
    users          = require('../controllers/users'),
    gifts          = require('../controllers/gifts'),
    cart          = require('../controllers/cart');

module.exports = function(app, express){
  app.use(morgan('dev'));
  app.use(less(__dirname + '/../static'));
  app.use(express.static(__dirname + '/../static'));
  app.use(bodyParser.urlencoded({extended:true}));
  app.use(methodOverride());
  app.use(session({store:new RedisStore(), secret:'my super secret key', resave:true, saveUninitialized:true, cookie:{maxAge:null}}));
  app.use(flash());
  passportConfig(passport, app);

  app.use(security.locals);
  app.use(debug.info);

  app.get('/', home.index);
  app.get('/register', users.new);
  app.post('/register', users.create);
  app.get('/login', users.login);
  app.post('/login', passport.authenticate('local', {successRedirect:'/', failureRedirect:'/login'}));
  app.get('/auth/google', passport.authenticate('google',  {scope: ['https://www.googleapis.com/auth/plus.login', 'https://www.googleapis.com/auth/plus.profile.emails.read']}));
  app.get('/auth/google/callback', passport.authenticate('google', {successRedirect:'/', failureRedirect:'/login'}));
  app.get('/auth/twitter', passport.authenticate('twitter'));
  app.get('/auth/twitter/callback', passport.authenticate('twitter', {successRedirect:'/', failureRedirect:'/login', successFlash:'You are in!', failureFlash:'Try again, Bozo!'}));
  app.get('/auth/facebook', passport.authenticate('facebook'));
  app.get('/auth/facebook/callback', passport.authenticate('facebook', {successRedirect:'/', failureRedirect:'/login', successFlash:'You are in!', failureFlash:'Try again, Bozo!'}));
  app.use(security.bounce);
  app.delete('/logout', users.logout);

  app.get('/profile', users.profile);
  app.get('/profile/edit', users.edit);
  app.post('/profile', users.update);
  app.get('/users', users.index);
  app.get('/users/:id', users.show);

  app.get('/gifts', gifts.index);
  app.post('/cart', cart.add);
  app.get('/cart', cart.index);
  app.delete('/cart', cart.destroy);
  app.post('/charge', cart.purchase);

  app.get('/messages', users.messages);
  app.post('/users/:id', users.send);

  app.get('/chasingtail/:id', users.chasingtail);
  app.post('/users', users.sendShindig);
  app.get('/shindigs', users.shindigs);

  console.log('Express: Routes Loaded');
};

