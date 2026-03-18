const { MASTER_ID } = require("./config");

const users = new Map();

users.set(MASTER_ID, { saldo: 1000000 });

const DAILY_INCOME = 500000;
const DAILY_INTERVAL_MS = 24 * 60 * 60 * 1000;

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

function addMoney(id, valor) {
  getUser(id).saldo += valor;
}

function getRanking() {
  return [...users.entries()]
    .sort((a, b) => b[1].saldo - a[1].saldo);
}

function startDailyIncome() {
  setInterval(() => {
    getUser(MASTER_ID).saldo += DAILY_INCOME;
    console.log(`[ECONOMY] Renda diária: +${DAILY_INCOME} moedas para o mestre.`);
  }, DAILY_INTERVAL_MS);
}

module.exports = { getUser, addMoney, transfer, getRanking, startDailyIncome };
