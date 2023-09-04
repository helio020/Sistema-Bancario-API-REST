const express = require('express');
const rotas = require('./router/rotas');

const app = express();

app.use(express.json());
app.use(rotas);

app.listen(3000);