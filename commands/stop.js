const { getGame, deleteGame } = require("../game");

module.exports = {
  data: {
    name: "stop",
    description: "Encerra o jogo em andamento neste canal"
  },

  async execute(interaction) {
    const game = getGame(interaction.channelId);

    if (!game) {
      return interaction.reply({ content: "❌ Não há jogo ativo neste canal.", ephemeral: true });
    }

    if (game.master !== interaction.user.id) {
      return interaction.reply({ content: "❌ Apenas o Mestre que iniciou o jogo pode encerrá-lo.", ephemeral: true });
    }

    deleteGame(interaction.channelId);

    await interaction.reply("🛑 Jogo encerrado pelo Mestre. Use `/iniciar` para começar um novo.");
  }
};
