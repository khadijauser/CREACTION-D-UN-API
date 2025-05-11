
exports.sessionAuth = (req, res, next) => {
  if (!req.session || !req.session.user) {
    return res.status(401).json({
      success: false,
      message: 'Non autorisé à accéder à cette ressource'
    });
  }

  req.user = req.session.user;

  next();
};

exports.authorizeSession = (...roles) => {
  return (req, res, next) => {
    if (!req.session || !req.session.user) {
      return res.status(401).json({
        success: false,
        message: 'Non autorisé à accéder à cette ressource'
      });
    }

    if (!roles.includes(req.session.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Le rôle ${req.session.user.role} n'est pas autorisé à accéder à cette ressource`
      });
    }
    next();
  };
};