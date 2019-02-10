const User = require('../models/user.model');

const auth = async (ctx, next) => {
  if (!ctx.headers.authorization) {
    ctx.status = 403;
    ctx.redirect(`${process.env.BASE_URL || 'http://localhost:8080'}/login`);
    ctx.body = 'Redirecting..';
  }
  else {
    const [authType, token] = ctx.headers.authorization.split(' ');
    ctx.user = await User.findOne({ token });
    return await next();
  }
};


module.exports = auth;