'use strict';

var bcrypt  = require('bcrypt'),
    Mongo   = require('mongodb'),
    _       = require('underscore-contrib'),
    fs      = require('fs'),
    path    = require('path'),
    twilio  = require('twilio'),
    Mailgun = require('mailgun-js'),
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
    User.collection.save(o, cb);
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
    switch(property){
      case 'visible':
        self.isVisible = fields[property][0] === 'visible';
        break;
      default:
        self[property] = fields[property][0];
    }
  });

  var oldphotos = this.photos,
      newphotos = moveFiles(files, oldphotos.length, '/img/' + this._id);
  this.photos = oldphotos.concat(newphotos);

  User.collection.save(this, cb);
};

User.prototype.send = function(receiver, obj, cb){
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

module.exports = User;

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

