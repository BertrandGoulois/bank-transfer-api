// server.js
const express = require('express');
const accountRoutes = require('./routes/accounts');
const authRoutes = require('./routes/authRoutes');
const app = express();

app.use(express.json());

app.get('/', (req, res) => res.send('API running'));

app.use('/accounts', accountRoutes);
app.use('/auth', authRoutes);

app.listen(3000, () => console.log('Server running on port 3000'));
module.exports = app;
