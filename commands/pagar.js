const { transfer } = require("../economy");
const { MASTER_ID } = require("../config");

module.exports = {
  data: {
    name: "pagar",
    description: "Pagar jogador (apenas o mestre)",
    options: [
      { name: "usuario", type: 6, description: "Jogador a receber", required: true },
      { name: "valor", type: 4, description: "Quantidade de moedas", required: true }
    ]
  },

  async execute(interaction) {
    if (interaction.user.id !== MASTER_ID) {
      return interaction.reply({ content: "❌ Apenas o mestre pode usar isso.", ephemeral: true });
    }

    const user = interaction.options.getUser("usuario");
    const valor = interaction.options.getInteger("valor");

    if (valor <= 0) {
      return interaction.reply({ content: "❌ O valor deve ser maior que zero.", ephemeral: true });
    }

    const ok = transfer(MASTER_ID, user.id, valor);
    if (!ok) {
      return interaction.reply({ content: "❌ Saldo insuficiente.", ephemeral: true });
    }

    await interaction.reply(`💰 **${valor}** moedas pagas para **${user.username}**`);
  }
};
