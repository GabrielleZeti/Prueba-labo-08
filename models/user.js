const pool = require('../config/database');

// Obtener todos los usuarios
const getUsers = async () => {
    const result = await pool.query('SELECT id, email FROM users ORDER BY id ASC');
    return result.rows;
};

// Obtener usuario por ID
const getUserById = async (id) => {
    const result = await pool.query('SELECT id, email FROM users WHERE id = $1', [id]);
    return result.rows[0];
};

// Obtener usuario por email (para login)
const getUserByEmail = async (email) => {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
};

// Crear usuario
const createUser = async (email, password) => {
    const result = await pool.query(
        'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email',
        [email, password]
    );
    return result.rows[0];
};

// Actualizar usuario
const updateUser = async (id, email, password) => {
    let query = 'UPDATE users SET email = $1';
    let params = [email];

    if (password) {
        query += ', password = $2';
        params.push(password);
    }

    query += ' WHERE id = $3 RETURNING id, email';
    params.push(id);

    const result = await pool.query(query, params);
    return result.rows[0];
};

// Eliminar usuario
const deleteUser = async (id) => {
    const result = await pool.query(
        'DELETE FROM users WHERE id = $1 RETURNING id, email',
        [id]
    );
    return result.rows[0];
};

module.exports = {
    getUsers,
    getUserById,
    getUserByEmail,
    createUser,
    updateUser,
    deleteUser
};