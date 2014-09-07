'use strict';

var async = require('async'),
    Mongo = require('mongodb');

function Message(senderId, receiverId, message){
  console.log('Message constructor entered');
  this.senderId   = senderId;
  this.receiverId = receiverId;
  this.message       = message;
  this.date       = new Date();
  this.isRead     = false;
  console.log('Message constructor ended');
}

Object.defineProperty(Message, 'collection', {
  get: function(){return global.mongodb.collection('messages');}
});

Message.create = function(o, userId, cb){
  var message = new Message(o, userId);
  Message.collection.save(message, cb);
};

Message.read = function(id, cb){
  var _id = Mongo.ObjectID(id);
  Message.collection.findAndModify({_id:_id}, [], {$set:{isRead:true}}, function(err, msg){
    iterator(msg, cb);
  });
};

Message.send = function(senderId, receiverId, message, cb){
  var m = new Message(senderId, receiverId, message);
  Message.collection.save(m, cb);
};

Message.unread = function(receiverId, cb){
  Message.collection.find({receiverId:receiverId, isRead:false}).count(cb);
};

Message.findAllMessagesByReceiverId = function(receiverId, cb){
  console.log('>>>>>>>  MESSAGE.MESSAGES - receiverId: ', receiverId);
  receiverId = Mongo.ObjectID(receiverId);
  Message.collection.find({receiverId:receiverId}).sort({date:-1}).toArray(function(err, msgs){
    console.log('>>>>>>>  MESSAGE.MESSAGES - msgs: ', msgs);
    async.map(msgs, iterator, cb);
  });
};

module.exports = Message;

function iterator(msg, cb){
  require('./user').findById(msg.senderId, function(err, sender){
    msg.sender = sender;
    cb(null, msg);
  });
}

