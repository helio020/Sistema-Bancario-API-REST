const { Router } = require('express');
const contas = require('../controllers/contas');
const transacoes = require('../controllers/transacoes');
const intermediador = require('../middleware/intermediador');

const rotas = Router();

rotas.get('/contas', intermediador.senha, contas.listarContas);
rotas.post('/contas', contas.criarConta);
rotas.put('/contas/:numeroConta/usuario', contas.atualizarUsuario);
rotas.delete('/contas/:numeroConta', contas.excluirConta);
rotas.post('/transacoes/depositar', transacoes.depositar);
rotas.post('/transacoes/sacar', transacoes.sacar);
rotas.post('/transacoes/transferir', transacoes.transferir);
rotas.get('/contas/saldo', contas.saldo);
rotas.get('/contas/extrato', contas.extrato);

module.exports = rotas;