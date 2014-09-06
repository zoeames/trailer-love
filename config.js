'use strict';

var config = {};

config.twitter = {
  apiKey      : 'TFbdETZdN4ZCHadvE7DXF6FOe',
  apiSecret   : process.env.TWITTER_SECRET,
  callbackUrl : 'http://matt-vm.com:3333/auth/twitter/callback'
};

config.google = {
  clientId : '417548404177-bmk48tavbdoq45cuaeep4sfqn0f4jb9v.apps.googleusercontent.com',
  clientSecret: process.env.GOOGLE_SECRET,
  callbackUrl : 'http://matt-vm.com:3333/auth/google/callback'
};

config.facebook = {
  clientId : '1476273802631750',
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackUrl : 'http://matt-vm.com:3333/auth/facebook/callback'
};

config.stripe = {
  publishKey : 'pk_test_w7Z1US0NscSQyYDobUEn8s5M',
  secretKey: process.env.STRIPE_SECRET
};

module.exports = config;
