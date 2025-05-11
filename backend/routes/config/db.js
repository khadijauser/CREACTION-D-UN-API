const mongoose = require('mongoose');

/**
 * Connexion à la base de données MongoDB
 * @returns {Promise} Connexion MongoDB
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log(`MongoDB connecté: ${conn.connection.host}`.cyan.underline.bold);
    return conn;
  } catch (error) {
    console.error(`Erreur: ${error.message}`.red);
    // Sortir du processus en cas d'échec de connexion
    process.exit(1);
  }
};

module.exports = connectDB;