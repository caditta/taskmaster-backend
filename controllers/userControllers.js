// backend/controllers/usersController.js
const bcrypt = require('bcryptjs');
const db = require('../src/config/bd');

exports.registerUser = async (req, res) => {
    const { username, email, password } = req.body;
    // console.log(username, email, password);

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Por favor, completa todos los campos' });
  }

    try {
        const userCheckQuery = 'SELECT * FROM users WHERE username = ? OR email = ?';
        db.query(userCheckQuery, [username, email], async (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Error al verificar el usuario' });
            }

            if (results.length > 0) {
                return res.status(400).json({ message: 'El nombre de usuario o el correo ya están en uso' });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const insertUserQuery = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
            db.query(insertUserQuery, [username, email, hashedPassword], (err, result) => {
                if (err) {
                    return res.status(500).json({ message: 'Error al registrar el usuario' });
                }
                res.status(201).json({ message: 'Usuario registrado correctamente' });
            });
        });
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor' });
    }
};
