/**
 * Middleware d'authentification par Session
 * Vérifie si l'utilisateur est connecté via session
 */
exports.sessionAuth = (req, res, next) => {
  // Vérifier si une session existe et contient un utilisateur
  if (!req.session || !req.session.user) {
    return res.status(401).json({
      success: false,
      message: 'Non autorisé à accéder à cette ressource'
    });
  }

  // Ajouter l'utilisateur à la requête
  req.user = req.session.user;

  next();
};

/**
 * Middleware pour filtrer l'accès selon le rôle (sessions)
 * @param  {...String} roles - Les rôles autorisés
 */
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