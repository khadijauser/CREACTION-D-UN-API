const express = require('express');
const router = express.Router();

// Controllers
const {
  register,
  login,
  logout,
  getMe,
  updateDetails,
  updatePassword
} = require('../controllers/authController');

// Middlewares
const { protect } = require('../middleware/auth');
const { basicAuth } = require('../middleware/basicAuth');
const { sessionAuth } = require('../middleware/sessionAuth');
const {
  registerValidation,
  loginValidation,
  updateDetailsValidation,
  updatePasswordValidation
} = require('../middleware/validator');

// Routes publiques
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);

// Routes protégées avec JWT
router.get('/logout', protect, logout);
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, updateDetailsValidation, updateDetails);
router.put('/updatepassword', protect, updatePasswordValidation, updatePassword);

// Routes alternatives avec Basic Auth
router.get('/me-basic', basicAuth, getMe);

// Routes alternatives avec Session Auth
router.get('/me-session', sessionAuth, getMe);

module.exports = router;