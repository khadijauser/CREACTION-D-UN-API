/**
 * Configuration CORS selon l'environnement
 */
const corsOptions = {
  // Origines autorisées
  origin: (origin, callback) => {
    // Liste des domaines autorisés
    const whitelist = [
      'http://localhost:3000',           // React dev server
      'http://localhost:5173',           // Vite dev server
      'https://votre-app-production.com' // URL de production
    ];

    // En développement, autoriser les requêtes sans origine (ex: Postman)
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Non autorisé par CORS'));
    }
  },
  // Autoriser les credentials (cookies, auth headers)
  credentials: true,
  // Méthodes HTTP autorisées
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  // Headers autorisés
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin'
  ],
  // Headers exposés au client
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  // Durée de mise en cache des options preflight (en secondes)
  maxAge: 86400 // 24 heures
};

module.exports = corsOptions;