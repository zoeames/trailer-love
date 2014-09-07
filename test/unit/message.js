/* jshint expr:true */
/* global describe, it, before, beforeEach */

'use strict';

var expect    = require('chai').expect,
    // Mongo     = require('mongodb'),
    Message   = require('../../app/models/message'),
    dbConnect = require('../../app/lib/mongodb'),
    cp        = require('child_process'),
    db        = 'trailer-test';

describe('Message', function(){
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
    it('should create a new Message object', function(done){
      var senderId   = '000000000000000000000001',
          receiverId = '000000000000000000000002',
          body       = 'msg body 1',
          m          = new Message(senderId, receiverId, body);
      expect(m).to.be.instanceof(Message);
      done();
    });
  });

  describe('.send', function(){
    it('should create a new Message object and save it to the message collection', function(done){
      var senderId   = '000000000000000000000001',
          receiverId = '000000000000000000000002',
          body       = 'hi';
      Message.send(senderId, receiverId, body, function(err, msg){
        console.log('>>> MESSAGE.SEND.U-TEST - msg: ', msg);
        expect(msg).to.be.instanceof(Message);
        expect(msg.senderId).to.equal('000000000000000000000001');
        expect(msg.receiverId).to.equal('000000000000000000000002');
        expect(msg.message).to.equal('hi');
        expect(msg.date).to.be.instanceof(Date);
        expect(msg.isRead).to.be.false;
        done();
      });
    });
  });

});
