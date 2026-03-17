const { getGame } = require("../game");
const { transfer, MASTER_ID } = require("../economy");

module.exports = {
  data: {
    name: "entrar",
    description: "Entra no jogo iniciado neste canal"
  },

  async execute(interaction) {
    const game = getGame(interaction.channelId);

    if (!game) {
      return interaction.reply({ content: "❌ Nenhum jogo iniciado neste canal.", ephemeral: true });
    }

    if (game.status !== "waiting") {
      return interaction.reply({ content: "❌ O jogo já está em andamento.", ephemeral: true });
    }

    const jaEntrou = game.jogadores.some(p => p.id === interaction.user.id);
    if (jaEntrou) {
      return interaction.reply({ content: "❌ Você já está no jogo.", ephemeral: true });
    }

    const ok = transfer(interaction.user.id, MASTER_ID, game.aposta);
    if (!ok) {
      return interaction.reply({ content: "❌ Você não tem moedas suficientes.", ephemeral: true });
    }

    game.jogadores.push({ id: interaction.user.id, dados: null, lei: null, caos: null });

    await interaction.reply(`✅ <@${interaction.user.id}> entrou no jogo! Jogadores: ${game.jogadores.length}`);
  }
};
