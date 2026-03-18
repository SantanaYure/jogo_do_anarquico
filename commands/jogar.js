const { getGame, rollForPlayers, chooseForBot } = require("../game");

module.exports = {
  data: {
    name: "jogar",
    description: "Inicia a rodada"
  },

  async execute(interaction) {
    const game = getGame(interaction.channelId);

    if (!game) return interaction.reply("Sem jogo.");

    rollForPlayers(game);
    game.status = "playing";

    // Bots escolhem automaticamente
    game.jogadores.forEach(p => {
      if (p.isBot) chooseForBot(p);
    });

    for (const p of game.jogadores) {
      const [d1, d2] = p.dados;

      if (p.isBot) continue;

      try {
        await p.user.send(
          `🎲 Seus dados: ${d1} e ${d2}\nEscolha com /escolher`
        );
      } catch (err) {
        await interaction.channel.send(
          `⚠️ ${p.user.username}, não consegui te mandar DM.\nAtive suas mensagens privadas!`
        );
      }
    }

    await interaction.reply("📩 Dados enviados no privado!");
  }
};
