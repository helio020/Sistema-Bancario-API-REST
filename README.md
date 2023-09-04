# Sistema-Bancário-API-REST

## Sobre:

API Rest para um sistema bancário, com operações CRUD (Create, Read, Update e Delete). A linguagem utilizada para desenvolver a API foi o JavaScript com Node.js utilizando os pacotes Express, nodemon e data-fns. 

## Como executar:

1. Faça o fork do projeto e em seguida clone para sua máquina.
2. Abra o VSCode na pasta clonada e digite este comando no terminal: 'npm install'. Em seguida, todos os pacotes listados como dependências serão instalados e estarão na pasta node_modules.
3. Depois de instalado os pacotes, iremos digitar 'npm run dev'. Com isso, teremos o servidor inicializado e para testar os endpoints utilize o Postman, Insomnia ou outros de sua escolha.

# Endpoints:

## Listar contas bancárias
http://localhost:3000/contas?senha_banco=Cubos123Bank

![](img/listar-contas.PNG)

## Criar conta bancária 
http://localhost:3000/contas

![](img/criar-conta.PNG)

## Atualizar os dados do usuário da conta bancária
http://localhost:3000/contas/:numeroConta/usuario

![](img/atualizar-conta.PNG)

## Excluir uma conta bancária
http://localhost:3000/contas/:numeroConta

![](img/excluir-conta.PNG)

## Depositar em uma conta bancária
http://localhost:3000/transacoes/depositar

![](img/depositar.PNG)

## Sacar de uma conta bancária 
http://localhost:3000/transacoes/sacar

![](img/sacar.PNG)

## Transferir valores entre contas bancárias
http://localhost:3000/transacoes/transferir

![](img/transferir.PNG)

## Consultar saldo da conta bancária
http://localhost:3000/contas/saldo?numero_conta=1&senha=12342

![](img/saldo.PNG)

## Emitir extrato bancário
http://localhost:3000/contas/extrato?numero_conta=1&senha=12342

![](img/extrato.PNG)
