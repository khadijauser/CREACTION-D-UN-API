const { body } = require('express-validator');

exports.registerValidation = [
  body('username')
    .notEmpty().withMessage('Le nom d\'utilisateur est requis')
    .isLength({ min: 3 }).withMessage('Le nom d\'utilisateur doit contenir au moins 3 caractères')
    .trim(),
  
  body('email')
    .notEmpty().withMessage('L\'adresse email est requise')
    .isEmail().withMessage('Adresse email invalide')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Le mot de passe est requis')
    .isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères')
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/).withMessage('Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre'),
  
  body('passwordConfirm')
    .notEmpty().withMessage('La confirmation du mot de passe est requise')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Les mots de passe ne correspondent pas');
      }
      return true;
    })
];

exports.loginValidation = [
  body('email')
    .notEmpty().withMessage('L\'adresse email est requise')
    .isEmail().withMessage('Adresse email invalide')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Le mot de passe est requis')
];

exports.updateDetailsValidation = [
  body('username')
    .optional()
    .isLength({ min: 3 }).withMessage('Le nom d\'utilisateur doit contenir au moins 3 caractères')
    .trim(),
  
  body('email')
    .optional()
    .isEmail().withMessage('Adresse email invalide')
    .normalizeEmail()
];

exports.updatePasswordValidation = [
  body('currentPassword')
    .notEmpty().withMessage('Le mot de passe actuel est requis'),
  
  body('newPassword')
    .notEmpty().withMessage('Le nouveau mot de passe est requis')
    .isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères')
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/).withMessage('Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre'),
  
  body('newPasswordConfirm')
    .notEmpty().withMessage('La confirmation du nouveau mot de passe est requise')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Les mots de passe ne correspondent pas');
      }
      return true;
    })
];