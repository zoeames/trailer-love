/* jshint expr:true */
/* global describe, it, before, beforeEach */

'use strict';

var expect    = require('chai').expect,
    User      = require('../../app/models/user'),
    dbConnect = require('../../app/lib/mongodb'),
    cp        = require('child_process'),
    Mongo     = require('mongodb'),
    db        = 'trailer-test';

describe('User', function(){
  before(function(done){
    dbConnect(db, function(){
      done();
    });
  });

  beforeEach(function(done){
    cp.execFile(__dirname + '/../scripts/clean-db.sh', [db], {cwd:__dirname + '/../scripts'}, function(err, stdout, stderr){
      done();
    });
  });

  describe('constructor', function(){
    it('should create a new User object', function(){
      var u = new User();
      expect(u).to.be.instanceof(User);
    });
  });

  describe('#save', function(){
    it('should save a users profile changes to the database', function(done){
      var user = new User({email:'date@date.com', password:'date',_id:Mongo.ObjectID('000000000000000000000010')}),
      reqBody = {date:'date', phone:'555-5555', visible:'public'};
      user.save(reqBody, function(err, user){
        expect(user.date).to.equal('date');
        done();
      });
    });
  });

  describe('.find', function(){
    it('should find users who are public', function(done){
      User.find({isVisible:true}, function(err, users){
        expect(users).to.have.length(3);
        done();
      });
    });
  });

  describe('.findOne', function(){
    it('should find a specific user', function(done){
      User.findOne({email:'bubs@aol.com', isVisible:true}, function(err, user){
        expect(user.email).to.equal('bubs@aol.com');
        done();
      });
    });
  });

  describe('.findById', function(){
    it('should find a user by its id', function(done){
      User.findById('000000000000000000000001', function(err, user){
        expect(user).to.be.instanceof(User);
        expect(user.name).to.equal('Bubbles');
        done();
      });
    });
  });

  describe('.register', function(){
    it('should regisiter a new user', function(done){
      User.register({email:'jim@aol.com', password:'1234'}, function(err, user){
        expect(user.email).to.equal('jim@aol.com');
        done();
      });
    });
  });

  describe('.googleAuthenticate', function(){
    it('should authenticate a user\'s google credentials', function(done){
      var obj = {id:'1234567'};
      User.googleAuthenticate({}, {}, obj, function(err, user){
        expect(user._id).to.be.instanceof(Mongo.ObjectID);
        done();
      });
    });
  });

  describe('.twitterAuthenticate', function(){
    it('should authenticate a user\'s twitter credentials', function(done){
      var obj = {id:'0000001'};
      User.twitterAuthenticate({}, {}, obj, function(err, user){
        expect(user._id).to.be.instanceof(Mongo.ObjectID);
        done();
      });
    });
  });
});

