'use strict';

var User   = require('../models/user'),
    Message   = require('../models/message'),
    moment = require('moment');

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

exports.update = function(req,res){
  console.log('req.body>>>>>', req.body);
  console.log('res.locals.user>>>>>>>>>', res.locals.user);
  User.findById(res.locals.user._id, function(err, user){
    user.save(req.body, function(){
      res.redirect('/profile');
    });
  });
};

exports.index = function(req,res){
  User.find({isPublic:true}, function(err, users){
    res.render('users/index', {users:users});
  });
};

exports.show = function(req,res){
  User.findById(req.params.id, function(err, client){
    if(client && client.isPublic){
      res.render('users/user', {client:client});
    }else{
      res.redirect('/users');
    }
  });
};

exports.client = function(req, res){
  User.findOne({email:req.params.email}, function(err, client){
    if(client){
      res.render('users/client', {client:client});
    }else{
      res.redirect('/profile');
    }
  });
};

exports.messages = function(req, res){
  res.locals.user.messages(function(err, messages){
    res.render('users/messages', {messages:messages, moment:moment});
  });
};

exports.message = function(req, res){
  Message.read(req.params.msgId, function(err, message){
    res.render('users/message', {message:message, moment:moment});
  });
};

exports.send = function(req, res){
  User.findById(req.params.userId, function(err, receiver){
    Message.send(res.locals.user._id, receiver._id, req.body, function(){
      res.redirect('/users/' + receiver.email);
    });
  });
};

