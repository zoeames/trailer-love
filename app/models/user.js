'use strict';

var bcrypt  = require('bcrypt'),
    Mongo   = require('mongodb'),
    _       = require('underscore-contrib'),
    fs      = require('fs'),
    path    = require('path'),
   // twilio  = require('twilio'),
    //Mailgun = require('mailgun-js'),
    Message = require('./message');

function User(){
}

Object.defineProperty(User, 'collection', {
  get: function(){return global.mongodb.collection('users');}
});

User.findById = function(id, cb){
  var _id = Mongo.ObjectID(id);
  User.collection.findOne({_id:_id}, function(err, obj){
    var user = Object.create(User.prototype);
    user = _.extend(user,obj);
    cb(err,user);
  });
};

User.register = function(o, cb){
  User.collection.findOne({email:o.email}, function(err, user){
    if(user){return cb();}
    o.password = bcrypt.hashSync(o.password, 10);
    o.photos = ['/img/welcome.jpg'];
    User.collection.save(o, function(){
      console.log('O.EMAIL', o.email);
      User.find({email:o.email}, function(err, newUser){
        console.log('NEWUSER', newUser);
        var bubs = Mongo.ObjectID('000000000000000000000001');
        Message.send(bubs, newUser._id, 'Welcome to Trailer-Love!!!', function(){
          cb();
        });
      });
    });
  });
};

User.localAuthenticate = function(email, password, cb){
  User.collection.findOne({email:email}, function(err, user){
    if(!user){return cb();}
    var isOk = bcrypt.compareSync(password, user.password);
    if(!isOk){return cb();}
    cb(null, user);
  });
};

User.googleAuthenticate = function(token, secret, google, cb){
  console.log(google);
  User.collection.findOne({googleId:google.id}, function(err, user){
    if(user){return cb(null, user);}
    user = {googleId:google.id, displayName:google.displayName, type:'google'};
    User.collection.save(user, cb);
  });
};

User.twitterAuthenticate = function(token, secret, twitter, cb){
  User.collection.findOne({twitterId:twitter.id}, function(err, user){
    if(user){return cb(null, user);}
    user = {twitterId:twitter.id, username:twitter.username, displayName:twitter.displayName, type:'twitter'};
    User.collection.save(user, cb);
  });
};

User.facebookAuthenticate = function(token, secret, facebook, cb){
  User.collection.findOne({facebookId:facebook.id}, function(err, user){
    if(user){return cb(null, user);}
    user = {facebookId:facebook.id, username:facebook.displayName, displayName:facebook.dispalyName, type:'facebook'};
    User.collection.save(user, cb);
  });
};

User.find = function(filter, cb){
  User.collection.find(filter).toArray(cb);
};

User.findOne = function(filter, cb){
  User.collection.findOne(filter, cb);
};

User.prototype.unread = function(cb){
  Message.unread(this._id, cb);
};

User.prototype.messages = function(cb){
  Message.messages(this._id, cb);
};

User.prototype.save = function(fields, files, cb){
  var properties = Object.keys(fields),
      self       = this;

  properties.forEach(function(property){
    self[property] = fields[property][0];
  });

  var oldphotos = this.photos,
      newphotos = moveFiles(files, oldphotos.length, '/img/' + this._id);
  this.photos = oldphotos.concat(newphotos);
  this.location = {name:this.loc, lat:this.lat, lng:this.lng};
  this.isVisible = (this.isVisible === 'true') ? true : false;
  User.collection.save(this, cb);
};

module.exports = User;

function moveFiles(files, count, relDir){
  var baseDir = __dirname + '/../static',
      absDir  = baseDir + relDir;

  if(!fs.existsSync(absDir)){fs.mkdirSync(absDir);}

  var tmpPhotos = files.photos.map(function(photo, index){
    if(!photo.size){return;}

    var ext      = path.extname(photo.path),
        name     = count + index + ext,
        absPath  = absDir + '/' + name,
        relPath  = relDir + '/' + name;

    fs.renameSync(photo.path, absPath);
    return relPath;
  });

  return _.compact(tmpPhotos);
}
