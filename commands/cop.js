const { SlashCommandBuilder } = require("discord.js");
const { getGame } = require("../game");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("cop")
    .setDescription("Adicionar jogador automático (COP)"),

  async execute(interaction) {
    const game = getGame(interaction.channelId);

    if (!game) {
      return interaction.reply("❌ Não há jogo ativo.");
    }

    const exists = game.jogadores.find(p => p.id === "COP");
    if (exists) {
      return interaction.reply("🤖 COP já está no jogo.");
    }

    game.jogadores.push({
      id: "COP",
      isBot: true,
      dados: [],
      lei: null,
      caos: null
    });

    await interaction.reply("🤖 COP entrou na partida!");
  }
};
