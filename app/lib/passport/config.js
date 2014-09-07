'use strict';

var local       = require('./local'),
    google      = require('./google'),
    facebook    = require('./facebook'),
    twitter     = require('./twitter'),
    serialize   = require('./serialize'),
    deserialize = require('./deserialize');

module.exports = function(passport, app){
  passport.use(local);
  passport.use(google);
  passport.use(twitter);
  passport.use(facebook);
  passport.serializeUser(serialize);
  passport.deserializeUser(deserialize);

  app.use(passport.initialize());
  app.use(passport.session());
};
