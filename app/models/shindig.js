'use strict';

var async = require('async'),
    Mongo = require('mongodb');

function Shindig(senderId, receiverId, shindig){
  console.log('Shindig constructor entered');
  this.senderId   = senderId;
  this.receiverId = receiverId;
  this.shindig       = shindig;
  this.date       = new Date();
  this.isRead     = false;
  console.log('Shindig constructor ended');
}

Object.defineProperty(Shindig, 'collection', {
  get: function(){return global.mongodb.collection('shindigs');}
});

Shindig.create = function(o, userId, cb){
  var shindig = new Shindig(o, userId);
  Shindig.collection.save(shindig, cb);
};

Shindig.read = function(id, cb){
  var _id = Mongo.ObjectID(id);
  Shindig.collection.findAndModify({_id:_id}, [], {$set:{isRead:true}}, function(err, msg){
    iterator(msg, cb);
  });
};

Shindig.send = function(senderId, receiverId, shindig, cb){
  var m = new Shindig(senderId, receiverId, shindig);
  Shindig.collection.save(m, cb);
};

Shindig.unread = function(receiverId, cb){
  Shindig.collection.find({receiverId:receiverId, isRead:false}).count(cb);
};

Shindig.findAllShindigsByReceiverId = function(receiverId, cb){
  console.log('>>>>>>>  Shindig.Shindig - receiverId: ', receiverId);
  receiverId = Mongo.ObjectID(receiverId);
  Shindig.collection.find({receiverId:receiverId}).sort({date:-1}).toArray(function(err, msgs){
    console.log('>>>>>>>  Shindig.Shindig - msgs: ', msgs);
    async.map(msgs, iterator, cb);
  });
};

module.exports = Shindig;

function iterator(msg, cb){
  require('./user').findById(msg.senderId, function(err, sender){
    msg.sender = sender;
    cb(null, msg);
  });
}

