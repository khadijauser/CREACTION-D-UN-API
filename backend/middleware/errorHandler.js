
const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;
  
    console.error(err);
  
    if (err.name === 'ValidationError') {
      const message = Object.values(err.errors).map(val => val.message);
      error = new Error(message.join(', '));
      error.statusCode = 400;
    }
  
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      const value = err.keyValue[field];
      const message = `${field.charAt(0).toUpperCase() + field.slice(1)} '${value}' est déjà utilisé`;
      error = new Error(message);
      error.statusCode = 400;
    }
  
    if (err.name === 'CastError') {
      const message = `Ressource non trouvée avec l'ID ${err.value}`;
      error = new Error(message);
      error.statusCode = 404;
    }
  
    if (err.name === 'JsonWebTokenError') {
      const message = 'Token non valide';
      error = new Error(message);
      error.statusCode = 401;
    }
  
    if (err.name === 'TokenExpiredError') {
      const message = 'Token expiré';
      error = new Error(message);
      error.statusCode = 401;
    }
  
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || 'Erreur serveur'
    });
  };
  
  module.exports = errorHandler;