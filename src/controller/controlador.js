let { contas, saques, depositos, transferencias } = require('../data/bancodedados');
const { format } = require('date-fns');

const buscarContaPorNumero = (numeroConta) => {
    return contas.find((conta) => conta.numero === numeroConta);
};

const verificarCpf = (cpf) => {
    return contas.find((conta) => conta.usuario.cpf === cpf);
};

const verificarEmail = (email) => {
    return contas.find((conta) => conta.usuario.email === email);
};

const listarContas = (req, res) => {
    return res.status(200).json(contas);
};

const criarConta = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
        return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios.' })
    }

    let cpfEncontrado = verificarCpf(cpf);
    let emailEncontrado = verificarEmail(email);

    if (cpfEncontrado || emailEncontrado) {
        return res.status(400).json({ mensagem: 'Já existe uma conta com o cpf ou e-mail informado!' })
    }

    let id = 1;

    if (contas.length > 0) {
        id = Number(contas[contas.length - 1].numero) + 1;
    }

    const conta = {
        numero: String(id),
        saldo: 0,
        usuario: {
            nome,
            cpf,
            data_nascimento,
            telefone,
            email,
            senha
        }
    }

    contas.push(conta);

    return res.status(204).send();
};

const atualizarUsuario = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;
    const { numeroConta } = req.params;

    if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
        return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios.' })
    }

    let cpfEncontrado = verificarCpf(cpf);
    let emailEncontrado = verificarEmail(email);

    if (cpfEncontrado) {
        return res.status(400).json({ mensagem: 'O CPF informado já existe cadastrado!' })
    }

    if (emailEncontrado) {
        return res.status(400).json({ mensagem: 'O email informado já existe cadastrado!' })
    }

    let contaEncontrada = buscarContaPorNumero(numeroConta);

    if (!contaEncontrada) {
        return res.status(404).json({ mensagem: 'O número da conta não existe.' })
    }

    contaEncontrada.usuario.nome = nome;
    contaEncontrada.usuario.cpf = cpf;
    contaEncontrada.usuario.data_nascimento = data_nascimento;
    contaEncontrada.usuario.telefone = telefone;
    contaEncontrada.usuario.email = email;
    contaEncontrada.usuario.senha = senha;

    return res.status(204).send();
};

const excluirConta = (req, res) => {
    const { numeroConta } = req.params;

    let contaEncontrada = buscarContaPorNumero(numeroConta);

    if (!contaEncontrada) {
        return res.status(404).json({ mensagem: 'O número da conta não existe.' })
    }

    if (contaEncontrada.saldo !== 0) {
        return res.status(403).json({ mensagem: 'A conta só pode ser removida se o saldo for zero!' })
    }

    contas = contas.filter((conta) => conta.numero !== numeroConta);

    return res.status(204).send();
};

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

const saldo = (req, res) => {
    const { numero_conta, senha } = req.query;

    if (!numero_conta || !senha) {
        return res.status(400).json({ mensagem: 'O numero da conta e senha são obrigatórios!' })
    }

    let contaEncontrada = buscarContaPorNumero(numero_conta);

    if (!contaEncontrada) {
        return res.status(404).json({ mensagem: 'Conta bancária não encontrada!' })
    }

    if (contaEncontrada.usuario.senha !== senha) {
        return res.status(403).json({ mensagem: 'A senha da conta informada é inválida!' });
    }

    return res.status(200).json({ saldo: contaEncontrada.saldo });
}

const extrato = (req, res) => {
    const { numero_conta, senha } = req.query;

    if (!numero_conta || !senha) {
        return res.status(400).json({ mensagem: 'O numero da conta e senha são obrigatórios!' })
    }

    let contaEncontrada = buscarContaPorNumero(numero_conta);

    if (!contaEncontrada) {
        return res.status(404).json({ mensagem: 'Conta bancária não encontrada!' })
    }

    if (contaEncontrada.usuario.senha !== senha) {
        return res.status(403).json({ mensagem: 'A senha da conta informada é inválida!' });
    }

    const depositosDaConta = depositos.filter((deposito) => {
        return deposito.numero_conta === numero_conta;
    });

    const saquesDaConta = saques.filter((saque) => {
        return saque.numero_conta === numero_conta;
    });

    const transferenciasEnviadas = transferencias.filter((transferencia) => {
        return transferencia.numero_conta_origem === numero_conta;
    });

    const transferenciasRecebidas = transferencias.filter((transferencia) => {
        return transferencia.numero_conta_destino === numero_conta;
    });

    const relatório = {
        depositos: depositosDaConta,
        saques: saquesDaConta,
        transferenciasEnviadas,
        transferenciasRecebidas
    };

    return res.status(200).json(relatório);
};

module.exports = {
    listarContas,
    criarConta,
    atualizarUsuario,
    excluirConta,
    depositar,
    sacar,
    transferir,
    saldo,
    extrato
};