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

// Ruta para el inicio de sesión
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Buscar el usuario en la base de datos por su nombre de usuario
    const user = await Users.findOne({ where: { username } });

    // Verificar si el usuario existe y si la contraseña coincide
    if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Generar un token JWT
    const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: '1h' });

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