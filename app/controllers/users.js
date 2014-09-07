'use strict';

var User   = require('../models/user'),
    Message   = require('../models/message');

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
  console.log('>>>>>>>>> CONTROLLER - send - RES', res);
  // senderId = res.locals.user._id
  debugger;
  User.findById(res.locals.user._id, function(err, client){
    console.log('>>>>>>>>> CONTROLLER - send - req.params.userId: ', req.params.userId);
    console.log('>>>>>>>>> CONTROLLER - send - client: ', client);
    console.log('>>>>>>>>> CONTROLLER - send - req.body: ', req.body);
    console.log('>>>>>>>>> CONTROLLER - send - res.locals: ', res.locals);
   // debugger;
    res.locals.user.send(client, req.body, function(){
      res.render('users', {client:client});
    });
  });
};

exports.messages = function(req, res){
  console.log('>>>>  fAMBR - req.params.id: ', req.params.id);
  Message.findAllMessagesByReceiverId(req.params.id, function(err, messages){
    console.log('>>>>  fAMBR - messages: ', messages);
    res.render('users/messages', {messages:messages});
  });
};


