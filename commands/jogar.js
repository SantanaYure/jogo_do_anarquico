const { getGame, rollForPlayers, chooseForBot } = require("../game");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

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

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId(`lei_${d1}_${p.id}`)
          .setLabel(`Lei = ${d1}`)
          .setStyle(ButtonStyle.Primary),

        new ButtonBuilder()
          .setCustomId(`lei_${d2}_${p.id}`)
          .setLabel(`Lei = ${d2}`)
          .setStyle(ButtonStyle.Secondary)
      );

      await interaction.channel.send({
        content: `🎲 ${p.user.username}, seus dados: **${d1}** e **${d2}**\nEscolha sua Lei:`,
        components: [row]
      });
    }

    await interaction.reply("🎲 Dados lançados! Faça sua escolha acima.");
  }
};
