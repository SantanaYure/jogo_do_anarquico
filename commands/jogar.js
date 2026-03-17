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
      if (p.isBot) continue;

      const [d1, d2] = p.dados;
      const user = await interaction.client.users.fetch(p.id);

      await user.send(
        `🎲 Seus dados: **${d1}** e **${d2}**\nUse \`/escolher lei:X caos:Y\``
      );
    }

    await interaction.reply("📩 Dados enviados no privado!");
  }
};
