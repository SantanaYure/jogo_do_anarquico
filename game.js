const games = new Map();

function createGame(channelId, aposta, masterId) {
  games.set(channelId, {
    aposta,
    status: "waiting",
    master: masterId,
    jogadores: []
  });
}

function getGame(channelId) {
  return games.get(channelId);
}

function rollD6() {
  return Math.floor(Math.random() * 6) + 1;
}

function addCOP(game) {
  game.jogadores.push({
    id: "COP",
    isBot: true,
    dados: [],
    lei: null,
    caos: null
  });
}

function rollForPlayers(game) {
  game.jogadores.forEach(p => {
    p.dados = [rollD6(), rollD6()];
  });
}

function chooseForBot(player) {
  const [d1, d2] = player.dados;

  // Estratégia simples:
  // 70% chance de jogar seguro (maior valor como Lei)
  if (Math.random() < 0.7) {
    player.lei = Math.max(d1, d2);
    player.caos = Math.min(d1, d2);
  } else {
    // 30% caos (invertido)
    player.lei = Math.min(d1, d2);
    player.caos = Math.max(d1, d2);
  }
}

function copChoose(game) {
  const cop = game.jogadores.find(p => p.isBot);
  if (!cop || cop.lei != null) return;
  chooseForBot(cop);
}

function allChosen(game) {
  // != null captura tanto null quanto undefined
  return game.jogadores.every(p => p.lei != null && p.caos != null);
}

function resolveGame(game) {
  const caos1 = game.jogadores.filter(p => p.caos === 1);

  if (caos1.length > 1) {
    return { tipo: "todos_perdem" };
  }

  if (caos1.length === 1) {
    // O único jogador que escolheu caos=1 vence pelo caminho do caos
    return { tipo: "caos", vencedor: caos1[0] };
  }

  // Nenhum escolheu caos=1: quem tiver maior lei vence
  const vencedor = game.jogadores.reduce((a, b) =>
    a.lei > b.lei ? a : b
  );

  return { tipo: "lei", vencedor };
}

module.exports = {
  createGame,
  getGame,
  addCOP,
  rollForPlayers,
  chooseForBot,
  copChoose,
  allChosen,
  resolveGame
};
