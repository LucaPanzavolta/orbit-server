const auth = async (ctx, next) => {
  if (!ctx.headers.authorization) {
    ctx.status = 403;
    ctx.redirect(`${process.env.BASE_URL ||  'http://localhost:8080'}/login`);
    ctx.body = 'TEST';
  }
  else {
    const [authType, token ] = ctx.headers.authorization.split(' ');
    ctx.user = await User.findOne({token});
    if (ctx.user) return await next();
    else {
      ctx.status = 403;
      ctx.redirect(`${process.env.BASE_URL ||  'http://localhost:8080'}/login`);
    }
  }
};

module.exports = auth;