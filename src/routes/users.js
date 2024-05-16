const express = require('express');
const { Router } = require("express");
const router = Router();
//para el hash de contraseñas
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Users } = require('./../db'); 
const cors = require('cors');


const secretKey = 'mySecretKey'; // Clave secreta para firmar los JWT 
const app = express();

// Permitir todas las solicitudes CORS
app.use(cors());

// Ruta para el registro de usuarios

router.post('/register', async (req, res) => {
    const { user, password, email } = req.body; // Incluye el campo 'email' en la desestructuración de req.body

    try {
        // Verificar si el usuario ya existe en la base de datos
        const existingUser = await Users.findOne({ where: { user } });
        if (existingUser) {
            return res.status(400).json({ error: 'El usuario ya existe' });
        }

        // Crear un nuevo usuario en la base de datos
        const hashedPassword = await bcrypt.hash(password, 10); 
        const newUser = await Users.create({ user, password: hashedPassword, email }); // Incluye el campo 'email'

        res.status(201).json({ message: 'Usuario creado exitosamente' });
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Ruta para el inicio de sesión
router.post('/login', async (req, res) => {
    const { user, password } = req.body;

    // Buscar el usuario en la base de datos por su nombre de usuario
    const username = await Users.findOne({ where: { user } });

    // Verificar si el usuario existe y si la contraseña coincide
    if (!username || !bcrypt.compareSync(password, username.password)) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Generar un token JWT
    const token = jwt.sign({ userId: username.id }, secretKey, { expiresIn: '1h' });

    // Enviar el token JWT como respuesta
    res.status(200).json({ token });
});

// Ruta protegida que requiere autenticación
router.get('/protected', authenticateToken, (req, res) => {
    res.json({ message: 'Acceso concedido' });
});

// Middleware para verificar el token JWT en las rutas protegidas
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.status(401).json({ error: 'Token de autenticación no proporcionado' });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Token de autenticación inválido' });
        }
        req.userId = decoded.userId;
        next();
    });
}

module.exports = router;