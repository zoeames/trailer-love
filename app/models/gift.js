'use strict';

var  Mongo  = require('mongodb'),
    _       = require('underscore-contrib');

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


module.exports = Gift;

