const { getUser } = require("../economy");

module.exports = {
  data: {
    name: "saldo",
    description: "Ver seu saldo"
  },

  async execute(interaction) {
    const user = getUser(interaction.user.id);

    await interaction.reply({ content: `💰 Saldo: **${user.saldo}** moedas`, ephemeral: true });
  }
};
