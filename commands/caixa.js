const { getGame } = require("../game");
const { getUser } = require("../economy");

module.exports = {
  data: {
    name: "caixa",
    description: "Mostra o saldo do mestre da partida atual"
  },

  async execute(interaction) {
    const game = getGame(interaction.channelId);

    if (!game) {
      return interaction.reply({ content: "❌ Sem jogo ativo neste canal.", ephemeral: true });
    }

    const master = getUser(game.master);
    const user = await interaction.client.users.fetch(game.master);

    await interaction.reply(`🏦 **Caixa do mestre (${user.username}):** ${master.saldo} moedas`);
  }
};
