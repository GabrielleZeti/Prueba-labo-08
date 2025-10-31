const userModel = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'clave_secreta_jerry';

// Sign In - Autenticación
const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email y contraseña son requeridos' });
        }

        // Obtener usuario por email
        const user = await userModel.getUserByEmail(email);
        if (!user) {
            return res.status(400).json({ error: 'Credenciales inválidas' });
        }

        // Verificar contraseña
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ error: 'Credenciales inválidas' });
        }

        // Generar token JWT
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email
            },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({
            message: 'Login exitoso',
            token,
            user: {
                id: user.id,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Error en signIn:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Obtener todos los usuarios
const getUsers = async (req, res) => {
    try {
        const users = await userModel.getUsers();
        res.json({
            message: 'Usuarios obtenidos exitosamente',
            data: users,
            count: users.length
        });
    } catch (error) {
        console.error('Error en getUsers:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Obtener usuario por ID
const getUserById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const user = await userModel.getUserById(id);

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json({
            message: 'Usuario obtenido exitosamente',
            data: user
        });
    } catch (error) {
        console.error('Error en getUserById:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Crear usuario
const createUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email y contraseña son requeridos' });
        }

        // Hash de la contraseña
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = await userModel.createUser(email, hashedPassword);

        res.status(201).json({
            message: 'Usuario creado exitosamente',
            data: newUser
        });
    } catch (error) {
        console.error('Error en createUser:', error);
        if (error.code === '23505') { // Violación de unique constraint
            res.status(400).json({ error: 'El email ya está registrado' });
        } else {
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
};

// Actualizar usuario
const updateUser = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { email, password } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email es requerido' });
        }

        let hashedPassword = null;
        if (password) {
            const saltRounds = 10;
            hashedPassword = await bcrypt.hash(password, saltRounds);
        }

        const updatedUser = await userModel.updateUser(id, email, hashedPassword);

        if (!updatedUser) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json({
            message: 'Usuario actualizado exitosamente',
            data: updatedUser
        });
    } catch (error) {
        console.error('Error en updateUser:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Eliminar usuario
const deleteUser = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const deletedUser = await userModel.deleteUser(id);

        if (!deletedUser) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json({
            message: 'Usuario eliminado exitosamente',
            data: deletedUser
        });
    } catch (error) {
        console.error('Error en deleteUser:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = {
    signIn,
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};