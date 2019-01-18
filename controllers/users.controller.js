'use strict';

const atob = require('atob');
const bcrypt = require('bcrypt');
const saltRounds = 15;
const uuidv1 = require('uuid/v1');
require('dotenv').config();

const filterProps = require('../services/utils').filterProps;
const User = require('../models/user.model');

// Create a new User
module.exports.create = async (ctx, next) => {
  console.log('XXX',ctx.request.method);
  if ('POST' != ctx.method) return await next();
  const userData = ctx.request.body;
  if (!userData.email || !userData.password || !userData.name) {
    ctx.status = 400;
    ctx.body = {
      errors:[
        'Username, e-mail and password cannot be empty!'
      ]
    };
    return await next();
  }
  if (userData.password.length < 8) {
    ctx.status = 400;
    ctx.body = {
      errors:[
        'Password cannot be shorter than 8 digits'
      ]
    };
    return await next();
  }
  let user = await User.findOne({email:userData.email});

  if (user) {
    ctx.status = 400;
    ctx.body = {
      errors:[
        'e-mail already exists.'
      ]
    };
    return await next();
  }
  let userObject = filterProps(userData, ['name','password','email']);
  let res;
  const hash = await bcrypt.hash(userObject.password, saltRounds);
  res = {name: userObject.name, email:userObject.email, password: hash, token: uuidv1()};
  user = await User.create(res);
  const answer = {
    id: user._id,
    name: user.name,
    email: user.email,
    token: user.token,
    workspaces: user.workspaces
  }
  ctx.status = 201;
  ctx.body = answer;
};

// Log in a User
module.exports.logIn = async (ctx, next) => {
  // Redundant - Checks if the method is GET ?
  if ('GET' != ctx.method) return await next();

  // extracts Auth header - email and password
  const [authType, encodedString ] = ctx.headers.authorization.split(' ');
  if (authType === 'Basic') {
    let [email, password] = atob(encodedString).split(':');

    let userExists = ctx.user = await User.findOne({email});
    
    if (userExists) {
      const passwordValid = await bcrypt.compare(password, ctx.user.password);
      if (passwordValid) {

        // Passwords match
        ctx.user.password ='********';
        ctx.status = 200;
        ctx.body = ctx.user;
      } 
      // Passwords DONT match
      else {
        ctx.status = 401;
        ctx.body = {
          errors:[
            'Wrong e-mail or password'
          ]
        };
        return await next();
      }
    } else {
      ctx.status = 401;
      ctx.body = {
        errors:[
          'Wrong e-mail or password'
        ]
      };
      return await next();
    }
  } else {
    let token = encodedString;
    ctx.user = await User.findOne({token});
    if(ctx.user) {
      ctx.status = 200;
      // delete ctx.user.password;
      ctx.user.password ='********';
      ctx.body = ctx.user;
    } else {
      ctx.status = 401;
      ctx.body = {
        errors:[
          'Wrong token!'
        ]
      };
      return await next();
    }
  }
};

// Remove a user
module.exports.removeUser = async (ctx, next) => {
  const user = await User.findOneAndRemove({token: ctx.user.token});
  ctx.user = '';
  ctx.status = 204;
}
