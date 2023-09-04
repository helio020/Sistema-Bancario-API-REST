const { Router } = require('express');
const controlador = require('../controller/controlador');
const intermediador = require('../middleware/intermediador');

const rotas = Router();

rotas.get('/contas', intermediador.senha, controlador.listarContas);
rotas.post('/contas', controlador.criarConta);
rotas.put('/contas/:numeroConta/usuario', controlador.atualizarUsuario);
rotas.delete('/contas/:numeroConta', controlador.excluirConta);
rotas.post('/transacoes/depositar', controlador.depositar);
rotas.post('/transacoes/sacar', controlador.sacar);
rotas.post('/transacoes/transferir', controlador.transferir);
rotas.get('/contas/saldo', controlador.saldo);
rotas.get('/contas/extrato', controlador.extrato);

module.exports = rotas;