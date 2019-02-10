const gate = async (ctx, next) => {
  if (ctx.user) await next();
  else {
    ctx.status = 302;
    ctx.redirect(`${process.env.BASE_URL || 'http://localhost:8080'}/login`);
  }
};

module.exports = gate;