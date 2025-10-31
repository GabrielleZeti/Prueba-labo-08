const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users');
const authenticateToken = require('../middleware/auth');

// Ruta pública
router.post('/signin', usersController.signIn);

// Rutas protegidas
router.get('/users', authenticateToken, usersController.getUsers);
router.get('/users/:id', authenticateToken, usersController.getUserById);
router.post('/users', authenticateToken, usersController.createUser);
router.put('/users/:id', authenticateToken, usersController.updateUser);
router.delete('/users/:id', authenticateToken, usersController.deleteUser);

module.exports = router;