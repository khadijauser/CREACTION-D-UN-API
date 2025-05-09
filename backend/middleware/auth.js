const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware d'authentification JWT
 * Protège les routes et ajoute l'utilisateur à req.user
 */
exports.protect = async (req, res, next) => {
  let token;

  // Vérifier si le token est présent dans les headers ou les cookies
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Extraire le token du header Authorization
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.token) {
    // Extraire le token des cookies
    token = req.cookies.token;
  }

  // Vérifier si le token existe
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Non autorisé à accéder à cette ressource'
    });
  }

  try {
    // Vérifier le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Ajouter l'utilisateur à la requête
    req.user = await User.findById(decoded.id);

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Non autorisé à accéder à cette ressource'
    });
  }
};

/**
 * Middleware pour filtrer l'accès selon le rôle
 * @param  {...String} roles - Les rôles autorisés
 */
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Non autorisé à accéder à cette ressource'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Le rôle ${req.user.role} n'est pas autorisé à accéder à cette ressource`
      });
    }
    next();
  };
};