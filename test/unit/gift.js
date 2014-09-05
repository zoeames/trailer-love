/* jshint expr:true */
/* global describe, it, before, beforeEach */

'use strict';

var expect    = require('chai').expect,
    Gift      = require('../../app/models/gift'),
    dbConnect = require('../../app/lib/mongodb'),
    cp        = require('child_process'),
    db        = 'trailer-test';

describe('Gift', function(){
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

  describe('.all', function(){
    it('Should Find all users who are public', function(done){
      Gift.all(function(err, gifts){
        expect(gifts).to.have.length(10);
        done();
      });
    });
  });
});

