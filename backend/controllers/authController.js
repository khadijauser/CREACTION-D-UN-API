const User = require('../models/User');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

/**
 * @desc    Inscription utilisateur
 * @route   POST /api/auth/register
 * @access  Public
 */
exports.register = async (req, res, next) => {
  try {
    // Vérification des erreurs de validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { username, email, password } = req.body;

    // Vérifier si l'utilisateur existe déjà
    let user = await User.findOne({ $or: [{ email }, { username }] });

    if (user) {
      return res.status(400).json({
        success: false,
        message: 'Un utilisateur avec cet email ou nom d\'utilisateur existe déjà'
      });
    }

    // Créer le nouvel utilisateur
    user = await User.create({
      username,
      email,
      password
    });

    // Générer le token JWT
    const token = user.generateJwtToken();

    // Répondre avec les informations utilisateur sans mot de passe
    const userResponse = {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role
    };

    // Envoyer la réponse
    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Connexion utilisateur
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = async (req, res, next) => {
  try {
    // Vérification des erreurs de validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Identifiants invalides'
      });
    }

    // Vérifier si le mot de passe correspond
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Identifiants invalides'
      });
    }

    // Mettre à jour la date de dernière connexion
    user.lastLogin = Date.now();
    await user.save({ validateBeforeSave: false });

    // Envoyer la réponse avec le token
    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Déconnexion utilisateur (efface le cookie)
 * @route   GET /api/auth/logout
 * @access  Private
 */
exports.logout = (req, res) => {
  // Pour JWT stocké dans les cookies
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000), // 10 secondes
    httpOnly: true
  });

  // Pour les sessions
  if (req.session) {
    req.session.destroy();
  }

  res.status(200).json({
    success: true,
    message: 'Déconnexion réussie'
  });
};

/**
 * @desc    Obtenir l'utilisateur actuel
 * @route   GET /api/auth/me
 * @access  Private
 */
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Mettre à jour les informations de l'utilisateur
 * @route   PUT /api/auth/updatedetails
 * @access  Private
 */
exports.updateDetails = async (req, res, next) => {
  try {
    // Vérification des erreurs de validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const fieldsToUpdate = {
      username: req.body.username,
      email: req.body.email
    };

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Mettre à jour le mot de passe
 * @route   PUT /api/auth/updatepassword
 * @access  Private
 */
exports.updatePassword = async (req, res, next) => {
  try {
    // Vérification des erreurs de validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const user = await User.findById(req.user.id).select('+password');

    // Vérifier le mot de passe actuel
    if (!(await user.matchPassword(req.body.currentPassword))) {
      return res.status(401).json({
        success: false,
        message: 'Le mot de passe actuel est incorrect'
      });
    }

    user.password = req.body.newPassword;
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// Fonction utilitaire pour envoyer le token dans la réponse
const sendTokenResponse = (user, statusCode, res) => {
  // Créer le token
  const token = user.generateJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  // Sécuriser le cookie en production
  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  // Envoyer le token comme cookie et dans le corps de la réponse
  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
};