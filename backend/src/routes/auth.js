const express = require('express');
const router = express.Router();
const database = require('../database');

// Login do administrador
router.post('/login', (req, res) => {
    const { usuario, senha } = req.body;
    
    if (!usuario || !senha) {
        return res.status(400).json({ 
            success: false, 
            message: 'Usuário e senha são obrigatórios' 
        });
    }
    
    database.get(
        "SELECT * FROM administradores WHERE usuario = ? AND senha = ?",
        [usuario, senha],
        (err, row) => {
            if (err) {
                console.error('Erro no login:', err);
                return res.status(500).json({ 
                    success: false, 
                    message: 'Erro no servidor' 
                });
            }
            
            if (row) {
                res.json({ 
                    success: true, 
                    message: 'Login realizado com sucesso',
                    user: { id: row.id, usuario: row.usuario }
                });
            } else {
                res.status(401).json({ 
                    success: false, 
                    message: 'Usuário ou senha incorretos' 
                });
            }
        }
    );
});

module.exports = router;
