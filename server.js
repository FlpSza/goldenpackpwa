const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');

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

// Servir arquivos estáticos (CSS, JS, imagens)
app.use(express.static(path.join(__dirname, 'public')));

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
app.get('/pedidos', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/pages', 'pedidos.html'));
});

// Rota para servir a página de rascunhos
app.get('/rascunhos', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/pages', 'rascunhos.html'));
});

// Rota para servir a página de clientes
app.get('/clientes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/pages', 'clientes.html'));
});

// Rota para servir a página de produtos
app.get('/produtos', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/pages', 'produtos.html'));
});

// Rota para servir a página de indicadores
app.get('/indicadores', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/pages', 'indicadores.html'));
});

// Rota para login de usuário
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const query = 'SELECT * FROM usuarios WHERE nome = ? AND senha = ?';
    db.query(query, [username, password], (err, result) => {
        if (err) {
            res.status(500).send('Erro no servidor');
            return;
        }

        if (result.length > 0) {
            res.status(200).send({ message: 'Login bem-sucedido', user: result[0] });
        } else {
            res.status(401).send({ message: 'Nome ou senha incorretos' });
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
            const insertQuery = 'INSERT INTO usuarios (nome, senha) VALUES (?, ?)';
            db.query(insertQuery, [username, password], (err, result) => {
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
app.post('/register-company', (req, res) => {
    const { cnpj, nome } = req.body;
    const userId = 1; // Substitua isso com o ID do usuário logado

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
app.get('/empresas', (req, res) => {
    const userId = 1; // Exemplo de ID do usuário, substitua conforme necessário

    const query = 'SELECT * FROM empresas WHERE usuario_id = ?';
    db.query(query, [userId], (err, result) => {
        if (err) {
            res.status(500).send('Erro ao buscar empresas');
            return;
        }
        res.status(200).send(result);
    });
});



// Iniciar o servidor
app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
