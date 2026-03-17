const { createGame, getGame } = require("../game");
const { getUser } = require("../economy");

module.exports = {
  data: {
    name: "iniciar",
    description: "Inicia o jogo",
    options: [
      {
        name: "aposta",
        type: 4,
        description: "Valor da aposta",
        required: true
      }
    ]
  },

  async execute(interaction) {
    const existing = getGame(interaction.channelId);
    if (existing) {
      return interaction.reply({ content: "❌ Já existe um jogo neste canal.", ephemeral: true });
    }

    const aposta = interaction.options.getInteger("aposta");

    // Garante saldo inicial ao mestre
    const master = getUser(interaction.user.id);
    if (!master.saldo) {
      master.saldo = 1000000;
    }

    createGame(interaction.channelId, aposta, interaction.user.id);

    await interaction.reply(
      `🎲 Jogo iniciado por **${interaction.user.username}** (Mestre)\n💰 Aposta: **${aposta}** moedas\nUse \`/entrar\` para participar.`
    );
  }
};
