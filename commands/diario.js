const { getUser, addMoney } = require("../economy");

const BONUS = 200;
const COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24 horas

module.exports = {
  data: {
    name: "diario",
    description: "Resgata seu bônus diário de 200 moedas"
  },

  async execute(interaction) {
    const user = getUser(interaction.user.id);
    const agora = Date.now();

    if (user.ultimoDiario && agora - user.ultimoDiario < COOLDOWN_MS) {
      const restante = COOLDOWN_MS - (agora - user.ultimoDiario);
      const horas = Math.floor(restante / (1000 * 60 * 60));
      const minutos = Math.floor((restante % (1000 * 60 * 60)) / (1000 * 60));

      return interaction.reply({
        content: `⏳ Você já resgatou hoje. Volte em **${horas}h ${minutos}m**.`,
        ephemeral: true
      });
    }

    user.ultimoDiario = agora;
    addMoney(interaction.user.id, BONUS);

    await interaction.reply(`🎁 Você resgatou **${BONUS} moedas**! Novo saldo: **${user.saldo}**`);
  }
};
