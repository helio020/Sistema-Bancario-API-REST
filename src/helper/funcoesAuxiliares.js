let { contas } = require('../data/bancodedados');

const buscarContaPorNumero = (numeroConta) => {
    return contas.find((conta) => conta.numero === numeroConta);
};

const verificarCpf = (cpf) => {
    return contas.find((conta) => conta.usuario.cpf === cpf);
};

const verificarEmail = (email) => {
    return contas.find((conta) => conta.usuario.email === email);
};

module.exports = {
    buscarContaPorNumero,
    verificarCpf,
    verificarEmail
}