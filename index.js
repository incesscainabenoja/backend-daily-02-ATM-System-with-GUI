// index.js
const express = require('express');
const session = require('express-session');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'change_this_secret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 } // 1 hour
}));

app.use(express.static(path.join(__dirname, 'public')));

// Simple in-memory "database" with one demo user
const users = {
  user1: {
    id: 'user1',
    name: 'Alice',
    pin: '1234',           // demo PIN
    balance: 1000.00,
    transactions: []       // newest first
  }
};

// Auth middleware
function requireAuth(req, res, next) {
  if (req.session && req.session.userId && users[req.session.userId]) return next();
  return res.status(401).json({ error: 'Not authenticated' });
}

// Login with PIN
app.post('/api/login', (req, res) => {
  const { pin } = req.body;
  if (!pin) return res.status(400).json({ error: 'PIN required' });

  const user = Object.values(users).find(u => u.pin === pin);
  if (!user) return res.status(401).json({ error: 'Invalid PIN' });

  req.session.userId = user.id;
  res.json({ success: true, name: user.name });
});

// Logout
app.post('/api/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ error: 'Logout failed' });
    res.json({ success: true });
  });
});

// Get account summary
app.get('/api/account', requireAuth, (req, res) => {
  const user = users[req.session.userId];
  res.json({ name: user.name, balance: user.balance });
});

// Deposit
app.post('/api/deposit', requireAuth, (req, res) => {
  const amount = parseFloat(req.body.amount);
  if (isNaN(amount) || amount <= 0) return res.status(400).json({ error: 'Invalid amount' });

  const user = users[req.session.userId];
  user.balance = +(user.balance + amount).toFixed(2);
  const tx = { id: uuidv4(), type: 'deposit', amount: +amount.toFixed(2), date: new Date().toISOString(), balanceAfter: user.balance };
  user.transactions.unshift(tx);
  res.json({ success: true, balance: user.balance, transaction: tx });
});

// Withdraw
app.post('/api/withdraw', requireAuth, (req, res) => {
  const amount = parseFloat(req.body.amount);
  if (isNaN(amount) || amount <= 0) return res.status(400).json({ error: 'Invalid amount' });

  const user = users[req.session.userId];
  if (amount > user.balance) return res.status(400).json({ error: 'Insufficient funds' });

  user.balance = +(user.balance - amount).toFixed(2);
  const tx = { id: uuidv4(), type: 'withdraw', amount: +amount.toFixed(2), date: new Date().toISOString(), balanceAfter: user.balance };
  user.transactions.unshift(tx);
  res.json({ success: true, balance: user.balance, transaction: tx });
});

// Transactions
app.get('/api/transactions', requireAuth, (req, res) => {
  const user = users[req.session.userId];
  res.json({ transactions: user.transactions });
});

// ✅ middleware fallback (works with Express v5)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = parseInt(process.env.PORT) || 3000;
app.listen(PORT, () => console.log(`ATM GUI running at http://localhost:${PORT}`));
