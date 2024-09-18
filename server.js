const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');


const app = express();
app.use(bodyParser.json());

// Configurar a conexão MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'golden_pack'
});

// Conectar ao banco de dados
db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao MySQL: ', err);
        return; 
    }
    console.log('Conectado ao MySQL');
});

app.use(cors({
    origin: 'http://localhost:3000', // Substitua pelo URL do seu frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000'); // Permitir requisições do frontend
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // Métodos permitidos
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Cabeçalhos permitidos
    next();
});

// Servir arquivos estáticos (CSS, JS, imagens)
app.use(express.static(path.join(__dirname, 'public')));

// Chave secreta para JWT
const JWT_SECRET = 'goldenpass';

const authenticateJWT = (req, res, next) => {
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];

    if (token) {
        console.log('Token recebido:', token); // Log do token recebido
        jwt.verify(token, JWT_SECRET, (err, user) => {
            if (err) {
                console.error('Erro ao verificar o token:', err); // Log do erro
                return res.sendStatus(403);
            }
            req.user = user;
            next();
        });
    } else {
        console.log('Nenhum token fornecido'); // Log quando não há token
        res.sendStatus(401);
    }
};


// Redirecionar a raiz para /login
app.get('/', (req, res) => {
    res.redirect('/login');
});

// Rota para servir a página de login
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/pages', 'login.html'));
});

// Rota para servir a página de registro de usuário
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/pages', 'register.html'));
});

// Rota para servir a página de registro de empresa
app.get('/register-company', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/pages', 'register-company.html'));
});

// Rota para servir a página de dashboard
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/pages', 'dashboard.html'));
});

// Rota para servir a página de pedidos
app.get('/pedidos',  (req, res) => {
    res.sendFile(path.join(__dirname, 'public/pages', 'pedidos.html'));
});

// Rota para servir a página de rascunhos
app.get('/rascunhos',  (req, res) => {
    res.sendFile(path.join(__dirname, 'public/pages', 'rascunhos.html'));
});

// Rota para servir a página de clientes
app.get('/clientes',  (req, res) => {
    res.sendFile(path.join(__dirname, 'public/pages', 'clientes.html'));
});

// Rota para servir a página de produtos
app.get('/produtos',  (req, res) => {
    res.sendFile(path.join(__dirname, 'public/pages', 'produtos.html'));
});

// Rota para servir a página de indicadores
app.get('/indicadores',  (req, res) => {
    res.sendFile(path.join(__dirname, 'public/pages', 'indicadores.html'));
});

// Rota para login de usuário
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    console.log('Username fornecido:', username);
    console.log('Senha fornecida:', password);

    const query = 'SELECT * FROM usuarios WHERE nome = ?';
    db.query(query, [username], (err, result) => {
        if (err) {
            console.error('Erro ao consultar usuário:', err);
            res.status(500).send('Erro no servidor');
            return;
        }

        console.log('Resultado da consulta:', result);

        if (result.length > 0) {
            const user = result[0];
            if (bcrypt.compareSync(password, user.senha)) {
                const token = jwt.sign({ id: user.id, nome: user.nome }, JWT_SECRET, { expiresIn: '1h' });
                console.log('Token gerado:', token);
                res.status(200).send({ token });
            } else {
                res.status(401).send({ message: 'Senha incorreta' });
            }
        } else {
            res.status(401).send({ message: 'Usuário não encontrado' });
        }
    });
});

// Rota para cadastro de usuário
app.post('/register', (req, res) => {
    const { username, password } = req.body;

    const checkQuery = 'SELECT * FROM usuarios WHERE nome = ?';
    db.query(checkQuery, [username], (err, result) => {
        if (err) {
            res.status(500).send('Erro no servidor');
            return;
        }

        if (result.length > 0) {
            res.status(400).send({ message: 'Nome de usuário já existe' });
        } else {
            const hashedPassword = bcrypt.hashSync(password, 8);
            const insertQuery = 'INSERT INTO usuarios (nome, senha) VALUES (?, ?)';
            db.query(insertQuery, [username, hashedPassword], (err, result) => {
                if (err) {
                    res.status(500).send('Erro ao registrar usuário');
                    return;
                }
                res.status(200).send({ message: 'Usuário registrado com sucesso' });
            });
        }
    });
});


// Rota para registro de empresa
app.post('/register-company', authenticateJWT, (req, res) => {
    const { cnpj, nome } = req.body;
    const userId = req.user.id;

    const checkQuery = 'SELECT * FROM empresas WHERE cnpj = ?';
    db.query(checkQuery, [cnpj], (err, result) => {
        if (err) {
            res.status(500).send('Erro no servidor');
            return;
        }

        if (result.length > 0) {
            res.status(400).send({ message: 'Empresa já registrada' });
        } else {
            const insertQuery = 'INSERT INTO empresas (cnpj, nome, usuario_id) VALUES (?, ?, ?)';
            db.query(insertQuery, [cnpj, nome, userId], (err, result) => {
                if (err) {
                    res.status(500).send('Erro ao registrar empresa');
                    return;
                }
                res.status(200).send({ message: 'Empresa registrada com sucesso' });
            });
        }
    });
});

// Rota para listar empresas do usuário
app.get('/empresas',  (req, res) => {
    const userId = req.user.id;

    const query = 'SELECT * FROM empresas WHERE usuario_id = ?';
    db.query(query, [userId], (err, result) => {
        if (err) {
            res.status(500).send('Erro ao buscar empresas');
            return;
        }
        res.status(200).json(result);
    });
});

// Iniciar o servidor
app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
