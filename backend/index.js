const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const usersRouter = require('./routes/users');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rutas
app.use('/api', usersRouter);

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({
        message: 'API REST con Node.js, Express y PostgreSQL',
        version: '1.0.0',
        endpoints: {
            auth: 'POST /api/signin',
            users: {
                get_all: 'GET /api/users',
                get_by_id: 'GET /api/users/:id',
                create: 'POST /api/users',
                update: 'PUT /api/users/:id',
                delete: 'DELETE /api/users/:id'
            }
        }
    });
});

// Manejo de errores 404
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejo de errores global
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Algo salió mal en el servidor' });
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
    console.log('Ambiente:', process.env.NODE_ENV || 'development');
});