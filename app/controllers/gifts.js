'use strict';

var Gift = require('../models/gift');

exports.index = function(req, res){
  Gift.all(function(err, gifts){
    res.render('gifts/index', {gifts:gifts});
  });
};


