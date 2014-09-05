/* global describe, before, beforeEach, it */

'use strict';

process.env.DB   = 'trailer-test';

var expect  = require('chai').expect,
    cp      = require('child_process'),
    app     = require('../../app/index'),
    cookie  = null,
    request = require('supertest');

describe('gifts', function(){
  before(function(done){
    request(app).get('/').end(done);
  });

  beforeEach(function(done){
    cp.execFile(__dirname + '/../scripts/clean-db.sh', [process.env.DB], {cwd:__dirname + '/../scripts'}, function(err, stdout, stderr){
      request(app)
      .post('/login')
      .send('email=bubs@aol.com')
      .send('password=1234')
      .end(function(err, res){
        cookie = res.headers['set-cookie'][0];
        done();
      });
    });
  });

  describe('get /gifts', function(){
    it('should show all the gifts', function(done){
      request(app)
      .get('/gifts')
      .set('cookie', cookie)
      .end(function(err, res){
        expect(res.status).to.equal(200);
        done();
      });
    });
  });
/*
  describe('get /profile', function(){
    it('should show the profile', function(done){
      request(app)
      .get('/profile')
      .set('cookie', cookie)
      .end(function(err, res){
        expect(res.status).to.equal(200);
        done();
      });
    });
  });

  describe('put /profile', function(){
    it('should edit the profile', function(done){
      request(app)
      .put('/profile')
      .send('_method=put&visible=private&email=bob%40aol.com&phone=5555555555&photo=bob.jpg&tagline=here%27s+bob.+&about=Hey.+I%27m+a+fun+guy.+Let%27s+have+mountain+dew+and+get+to+know+each+other%21')
      .set('cookie', cookie)
      .end(function(err, res){
        expect(res.status).to.equal(302);
        expect(res.headers.location).to.equal('/profile');
        done();
      });
    });
  });*/
});

