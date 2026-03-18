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

function deleteGame(channelId) {
  games.delete(channelId);
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
  const invertidos = [];

  // Agrupar jogadores pelo valor do Caos
  const grupos = {};
  game.jogadores.forEach(p => {
    if (!grupos[p.caos]) grupos[p.caos] = [];
    grupos[p.caos].push(p);
  });

  // Ímpar de jogadores com mesmo Caos → todos do grupo invertem
  // Par → neutro, ninguém inverte
  Object.values(grupos).forEach(grupo => {
    if (grupo.length % 2 !== 0) {
      grupo.forEach(p => {
        invertidos.push({ id: p.id, valorCaos: p.caos, total: grupo.length });
        [p.lei, p.caos] = [p.caos, p.lei];
      });
    }
  });

  // Disputa pelo maior Caos (após inversões)
  const vencedor = game.jogadores.reduce((a, b) =>
    a.caos > b.caos ? a : b
  );

  // Empate no Caos: todos perdem
  const empatados = game.jogadores.filter(p => p.caos === vencedor.caos);
  if (empatados.length > 1) {
    return { tipo: "todos_perdem", invertidos };
  }

  return { tipo: "caos", vencedor, invertidos };
}

module.exports = {
  createGame,
  getGame,
  deleteGame,
  addCOP,
  rollForPlayers,
  chooseForBot,
  copChoose,
  allChosen,
  resolveGame
};
