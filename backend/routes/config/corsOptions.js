
const corsOptions = {
  origin: (origin, callback) => {
    const whitelist = [
      'http://localhost:3000',           // React dev server
      'http://localhost:5173',           // Vite dev server
      'https://votre-app-production.com' // URL de production
    ];

    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Non autorisé par CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin'
  ],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400 // 24 heures
};

module.exports = corsOptions;