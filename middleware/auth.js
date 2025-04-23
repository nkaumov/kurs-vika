exports.requireManager = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'manager') {
      return next();
    }
    res.redirect('/login');
  };
  
  exports.requireMaster = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'master') {
      return next();
    }
    res.redirect('/login');
  };
  