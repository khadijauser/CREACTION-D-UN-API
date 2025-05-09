const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');

// Chargement des variables d'environnement
dotenv.config();

// Connexion à la base de données
const connectDB = require('./config/db');
connectDB();

// Import des middlewares
const errorHandler = require('./middleware/errorHandler');

// Import des routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

// Configuration des options CORS
const corsOptions = require('./config/corsOptions');

// Initialisation de l'application Express
const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors(corsOptions));

// Logger en développement
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Configuration des sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL,
      collectionName: 'sessions'
    }),
    cookie: {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 jour
      secure: process.env.NODE_ENV === 'production'
    }
  })
);

// Routes API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Servir le frontend en production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend', 'dist', 'index.html'));
  });
}

// Middleware de gestion des erreurs
app.use(errorHandler);

// Port et démarrage du serveur
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(
    `Serveur démarré en mode ${process.env.NODE_ENV} sur le port ${PORT}`.yellow.bold
  );
});

// Gestion des erreurs non gérées
process.on('unhandledRejection', (err, promise) => {
  console.log(`Erreur: ${err.message}`.red);
  // Fermer le serveur & quitter le processus
  server.close(() => process.exit(1));
});