const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Simula banco de dados simples
const dbPath = './database.json';
let db = { usuarios: [], produtos: [] };

if (fs.existsSync(dbPath)) {
  db = JSON.parse(fs.readFileSync(dbPath));
}

function salvarDB() {
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
}

// ROTAS DE PÁGINAS
app.get('/', (req, res) => res.sendFile(__dirname + '/views/login.html'));
app.get('/dashboard', (req, res) => res.sendFile(__dirname + '/views/dashboard.html'));
app.get('/cadastro_usuario', (req, res) => res.sendFile(__dirname + '/views/cadastro_usuario.html'));
app.get('/cadastro_produto', (req, res) => res.sendFile(__dirname + '/views/cadastro_produto.html'));
app.get('/loja', (req, res) => res.sendFile(__dirname + '/views/loja.html'));

// LOGIN
app.post('/login', (req, res) => {
    const { email, senha } = req.body;
    if (email === 'admin@cafe.com' && senha === 'admin') {
      res.json({ success: true });
    } else {
      res.status(401).json({ success: false });
    }
  });

// USUÁRIOS
app.get('/api/usuarios', (req, res) => res.json(db.usuarios));

app.post('/api/usuarios', (req, res) => {
  db.usuarios.push(req.body);
  salvarDB();
  res.json({ success: true });
});

app.delete('/api/usuarios/:id', (req, res) => {
  db.usuarios = db.usuarios.filter(u => u.id !== req.params.id);
  salvarDB();
  res.json({ success: true });
});

// PRODUTOS
app.get('/api/produtos', (req, res) => res.json(db.produtos));

app.post('/api/produtos', (req, res) => {
  db.produtos.push(req.body);
  salvarDB();
  res.json({ success: true });
});

app.delete('/api/produtos/:nome', (req, res) => {
  db.produtos = db.produtos.filter(p => p.nome !== req.params.nome);
  salvarDB();
  res.json({ success: true });
});

// COMPRA
app.post('/api/comprar', (req, res) => {
  res.json({ mensagem: "Compra realizada com sucesso!" });
});

app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});
