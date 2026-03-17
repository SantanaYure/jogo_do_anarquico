const { MASTER_ID } = require("./config");

const users = new Map();

users.set(MASTER_ID, { saldo: 1000000 });

function getUser(id) {
  if (!users.has(id)) {
    users.set(id, { saldo: 500 });
  }
  return users.get(id);
}

function transfer(from, to, valor) {
  if (valor <= 0) return false;

  const userFrom = getUser(from);
  const userTo = getUser(to);

  if (userFrom.saldo < valor) return false;

  userFrom.saldo -= valor;
  userTo.saldo += valor;

  console.log(`[TRANSFER] ${from} -> ${to}: ${valor} moedas`);
  return true;
}

function getRanking() {
  return [...users.entries()]
    .sort((a, b) => b[1].saldo - a[1].saldo);
}

module.exports = { getUser, transfer, getRanking, MASTER_ID };
