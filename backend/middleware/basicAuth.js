const User = require('../models/User');

/**
 * Middleware d'authentification Basic Auth
 * Vérifie les identifiants dans le header Authorization
 */
exports.basicAuth = async (req, res, next) => {
  // Vérifier si le header Authorization est présent
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return res.status(401).json({
      success: false,
      message: 'Authentification Basic requise'
    });
  }

  try {
    // Extraire et décoder les identifiants
    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('utf8');
    const [email, password] = credentials.split(':');

    if (!email || !password) {
      return res.status(401).json({
        success: false,
        message: 'Identifiants invalides'
      });
    }

    // Vérifier l'utilisateur et le mot de passe
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Identifiants invalides'
      });
    }

    // Ajouter l'utilisateur à la requête
    req.user = user;

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'authentification'
    });
  }
};