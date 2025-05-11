const express = require('express');
const router = express.Router();

// Controllers
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/userController');

// Middlewares
const { protect, authorize } = require('../middleware/auth');
const { basicAuth } = require('../middleware/basicAuth');
const { sessionAuth, authorizeSession } = require('../middleware/sessionAuth');
const {
  registerValidation,
  updateDetailsValidation
} = require('../middleware/validator');

// Routes administrateur - Protection JWT
router.use(protect);
router.use(authorize('admin'));

router.route('/')
  .get(getUsers)
  .post(registerValidation, createUser);

router.route('/:id')
  .get(getUser)
  .put(updateDetailsValidation, updateUser)
  .delete(deleteUser);

router.get('/basic', basicAuth, authorize('admin'), getUsers);

router.get('/session', sessionAuth, authorizeSession('admin'), getUsers);

module.exports = router;