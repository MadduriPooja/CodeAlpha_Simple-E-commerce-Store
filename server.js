const express = require('express');
const fs = require('fs');
const session = require('express-session');
const bcrypt = require('bcrypt');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));

let data = JSON.parse(fs.readFileSync('data.json'));

// Middleware to check login
function requireLogin(req, res, next) {
  if (!req.session.user) return res.status(401).send("Please login to view details");
  next();
}

// Routes
app.get('/api/products', requireLogin, (req, res) => res.json(data.products));

app.get('/api/product/:id', requireLogin, (req, res) => {
  const product = data.products.find(p => p.id == req.params.id);
  if (product) res.json(product);
  else res.sendStatus(404);
});

app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  if (data.users.find(u => u.username === username)) return res.sendStatus(400);
  const hash = await bcrypt.hash(password, 10);
  data.users.push({ username, password: hash });
  fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
  res.sendStatus(201);
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = data.users.find(u => u.username === username);
  if (user && await bcrypt.compare(password, user.password)) {
    req.session.user = username;
    res.sendStatus(200);
  } else res.sendStatus(401);
});

app.post('/api/logout', (req, res) => {
  req.session.destroy();
  res.sendStatus(200);
});

app.post('/api/cart', requireLogin, (req, res) => {
  if (!req.session.cart) req.session.cart = [];
  req.session.cart.push(req.body.productId);
  res.sendStatus(200);
});

app.get('/api/cart', requireLogin, (req, res) => {
  res.json(req.session.cart || []);
});

app.post('/api/order', requireLogin, (req, res) => {
  const order = { user: req.session.user, items: req.session.cart || [] };
  data.orders.push(order);
  fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
  req.session.cart = [];
  res.sendStatus(201);
});

app.listen(3000, () => console.log('Server running at http://localhost:3000'));
