/**
 * Middleware de gestion globale des erreurs
 * Convertit les erreurs en format de réponse JSON standardisé
 */
const errorHandler = (err, req, res, next) => {
    // Copier l'erreur pour ne pas modifier l'originale
    let error = { ...err };
    error.message = err.message;
  
    // Log pour le développeur
    console.error(err);
  
    // Erreur de validation Mongoose
    if (err.name === 'ValidationError') {
      const message = Object.values(err.errors).map(val => val.message);
      error = new Error(message.join(', '));
      error.statusCode = 400;
    }
  
    // Erreur de doublon (clé unique)
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      const value = err.keyValue[field];
      const message = `${field.charAt(0).toUpperCase() + field.slice(1)} '${value}' est déjà utilisé`;
      error = new Error(message);
      error.statusCode = 400;
    }
  
    // Erreur d'ID Mongoose non trouvé
    if (err.name === 'CastError') {
      const message = `Ressource non trouvée avec l'ID ${err.value}`;
      error = new Error(message);
      error.statusCode = 404;
    }
  
    // Erreur de JWT
    if (err.name === 'JsonWebTokenError') {
      const message = 'Token non valide';
      error = new Error(message);
      error.statusCode = 401;
    }
  
    // Erreur d'expiration JWT
    if (err.name === 'TokenExpiredError') {
      const message = 'Token expiré';
      error = new Error(message);
      error.statusCode = 401;
    }
  
    // Réponse avec le statut et le message d'erreur
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || 'Erreur serveur'
    });
  };
  
  module.exports = errorHandler;