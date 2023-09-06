let { saques, depositos, transferencias } = require('../data/bancodedados');
const { buscarContaPorNumero } = require('../helper/funcoesAuxiliares');
const { format } = require('date-fns');

const depositar = (req, res) => {
    const { numero_conta, valor } = req.body;

    if (!numero_conta || !valor) {
        return res.status(400).json({ mensagem: 'O número da conta e o valor são obrigatórios!' })
    }

    let contaEncontrada = buscarContaPorNumero(numero_conta);

    if (!contaEncontrada) {
        return res.status(404).json({ mensagem: 'O número da conta não existe.' })
    }

    if (valor <= 0) {
        return res.status(403).json({ mensagem: 'Não é possível depositar valores negativos ou igual a zero.' })
    }

    contaEncontrada.saldo += valor;

    const registroDeposito = {
        data: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        numero_conta,
        valor: Number(valor)
    }

    depositos.push(registroDeposito);

    return res.status(204).send();
};

const sacar = (req, res) => {
    const { numero_conta, valor, senha } = req.body;

    if (!numero_conta || !valor || !senha) {
        return res.status(400).json({ mensagem: 'O número da conta, valor e senha são obrigatórios!' })
    }

    let contaEncontrada = buscarContaPorNumero(numero_conta);

    if (!contaEncontrada) {
        return res.status(404).json({ mensagem: 'O número da conta não existe.' })
    }

    if (contaEncontrada.usuario.senha !== senha) {
        return res.status(403).json({ mensagem: 'A senha é inválida para a conta informada!' })
    }

    if (contaEncontrada.saldo <= 0) {
        return res.status(403).json({ mensagem: 'Não há saldo disponível para saque! ' })
    }

    if (valor < 0) {
        return res.status(403).json({ mensagem: 'O valor não pode ser menor que zero!' })
    }

    contaEncontrada.saldo -= valor;

    const registroSaque = {
        data: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        numero_conta,
        valor: Number(valor)
    }

    saques.push(registroSaque);

    return res.status(204).send();
};

const transferir = (req, res) => {
    const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body;

    if (!numero_conta_origem || !numero_conta_destino || !valor || !senha) {
        return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios!' })
    }

    if (valor < 0) {
        return res.status(403).json({ mensagem: 'Valores abaixo de zero não são permitidos.' })
    }

    if (numero_conta_origem === numero_conta_destino) {
        return res.status(403).json({ mensagem: 'Não é permitido transferir valores na mesma conta.' })
    }

    let contaOrigem = buscarContaPorNumero(numero_conta_origem);

    if (!contaOrigem) {
        return res.status(404).json({ mensagem: 'A conta de origem informada não existe.' })
    }

    if (contaOrigem.usuario.senha !== senha) {
        return res.status(403).json({ mensagem: 'A senha da conta informada é inválida!' })
    }

    if (contaOrigem.saldo <= 0) {
        return res.status(403).json({ mensagem: 'Saldo insuficiente para transferência!' })
    }

    let contaDestino = buscarContaPorNumero(numero_conta_destino);

    if (!contaDestino) {
        return res.status(404).json({ mensagem: 'A conta de destino informada não existe.' })
    }

    contaOrigem.saldo -= valor;
    contaDestino.saldo += valor;

    const registroTransferencia = {
        data: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        numero_conta_origem,
        numero_conta_destino,
        valor: Number(valor)
    }

    transferencias.push(registroTransferencia);

    return res.status(204).send();
};

module.exports = {
    depositar,
    sacar,
    transferir
}