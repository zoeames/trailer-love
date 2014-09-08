'use strict';

var User    = require('../models/user'),
    Message = require('../models/message'),
    Shindig = require('../models/shindig'),
    moment  = require('moment'),
    mp      = require('multiparty');

exports.new = function(req, res){
  res.render('users/new');
};

exports.login = function(req, res){
  res.render('users/login');
};

exports.logout = function(req, res){
  req.session.destroy(function(){
    res.redirect('/');
  });
};

exports.create = function(req, res){
  User.register(req.body, function(err, user){
    if(user){
      res.redirect('/');
    }else{
      res.redirect('/register');
    }
  });
};

exports.authenticate = function(req, res){
  User.authenticate(req.body, function(user){
    if(user){
      req.session.regenerate(function(){
        req.session.userId = user._id;
        req.session.save(function(){
          res.redirect('/');
        });
      });
    }else{
      res.redirect('/login');
    }
  });
};

exports.profile = function(req,res){
  res.render('users/profile');
};

exports.edit = function(req,res){
  res.render('users/edit');
};

exports.update = function(req, res){
  var form = new mp.Form();
  form.parse(req, function(err, fields, files){
    User.findById(res.locals.user._id, function(err, user){
      user.save(fields, files, function(err, cb){
        res.redirect('/profile');
      });
    });
  });
};

exports.index = function(req,res){
  User.find({isVisible:true}, function(err, users){
    res.render('users/index', {users:users});
  });
};

exports.show = function(req,res){
  User.findById(req.params.id, function(err, client){
    if(client && client.isVisible){
      res.render('users/show', {client:client});
    }else{
      res.redirect('/users');
    }
  });
};

exports.send = function(req, res){
  User.findById(req.params.id, function(err, client){
    Message.send(res.locals.user._id, client._id, req.body.message, function(){
      res.redirect('/users');
    });
  });
};

exports.messages = function(req, res){
  Message.findAllMessagesByReceiverId(res.locals.user._id, function(err, messages){
    User.findById(messages[0].senderId, function(err, sender){
      res.render('users/messages', {sender:sender, messages:messages, moment:moment});
    });
  });
};

exports.chasingtail = function(req, res){
  console.log('REQ PARAMS', req.params.id);
  User.findById(req.params.id, function(err, client){
    console.log('CLIENT CLIENT', client);
    res.render('users/shindig', {client:client});
  });
};

exports.sendShindig = function(req, res){
  User.findById(req.params, function(err, client){
    console.log('>>>>>>>>> CONTROLLER - send - client: ', client);
    console.log('>>>>>>>>> CONTROLLER - send - MESSAGE: ', req.body.shindig);
    Shindig.send(res.locals.user._id, client._id, req.body.shindig, function(){
      res.redirect('/users');
    });
  });
};

exports.shindigs = function(req, res){
  Shindig.findAllShindigsByReceiverId(res.locals.user._id, function(err, shindigs){
    User.findById(shindigs[0].senderId, function(err, sender){
      res.render('users/shindigs', {sender:sender, shindigs:shindigs, moment:moment});
    });
  });
};


