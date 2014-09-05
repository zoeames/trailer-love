'use strict';

var config = {};

config.stripe = {
  publishKey : 'pk_test_w7Z1US0NscSQyYDobUEn8s5M',
  secretKey: process.env.STRIPE_SECRET
};

module.exports = config;
