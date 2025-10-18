const express = require('express');
const routes = require('./routes/accounts');
const app = express();

app.use(express.json());

app.get('/', (req, res) => res.send('API running'));

app.use('/accounts', routes);

app.listen(3000, () => console.log('Server running on port 3000'));
module.exports = app;