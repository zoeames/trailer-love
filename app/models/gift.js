'use strict';

var  Mongo  = require('mongodb'),
    _       = require('underscore-contrib'),
    twilio  = require('twilio'),
    Mailgun = require('mailgun-js'),
    Message = require('./message');

function Gift(){
}

Object.defineProperty(Gift, 'collection', {
  get: function(){return global.mongodb.collection('gifts');}
});

Gift.findById = function(id, cb){
  var _id = Mongo.ObjectID(id);
  Gift.collection.findOne({_id:_id}, function(err, obj){
    var gift = Object.create(Gift.prototype);
    gift = _.extend(gift,obj);
    cb(err, gift);
  });
};

Gift.all = function(cb){
  Gift.collection.find().toArray(cb);
};

Gift.prototype.unread = function(cb){
  Message.unread(this._id, cb);
};

Gift.prototype.messages = function(cb){
  Message.messages(this._id, cb);
};

Gift.prototype.save = function(o, cb){
  var properties = Object.keys(o),
      self       = this;

  properties.forEach(function(property){
    switch(property){
      case 'visible':
        self.isVisible = o[property] === 'public';
        break;
      default:
        self[property] = o[property];
    }
  });

  Gift.collection.save(this, cb);
};

Gift.prototype.send = function(receiver, obj, cb){
  switch(obj.mtype){
    case 'text':
      sendText(receiver.phone, obj.message, cb);
      break;
    case 'email':
      sendEmail(this.email, receiver.email, 'Message from Facebook', obj.message, cb);
      break;
    case 'internal':
      Message.send(this._id, receiver._id, obj.message, cb);
  }
};

module.exports = Gift;

function sendText(to, body, cb){
  if(!to){return cb();}

  var accountSid = process.env.TWSID,
      authToken  = process.env.TWTOK,
      from       = process.env.FROM,
      client     = twilio(accountSid, authToken);

  client.messages.create({to:to, from:from, body:body}, cb);
}

function sendEmail(from, to, subject, message, cb){
  var mailgun = new Mailgun({apiKey:process.env.MGKEY, domain:process.env.MGDOM}),
      data   = {from:from, to:to, subject:subject, text:message};

  mailgun.messages().send(data, cb);
}
