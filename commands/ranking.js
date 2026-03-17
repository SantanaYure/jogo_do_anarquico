const { getRanking } = require("../economy");

const MEDALHAS = ["🥇", "🥈", "🥉"];

module.exports = {
  data: {
    name: "ranking",
    description: "Top jogadores por saldo"
  },

  async execute(interaction) {
    const ranking = getRanking().slice(0, 10);

    if (ranking.length === 0) {
      return interaction.reply("Nenhum jogador registrado ainda.");
    }

    const linhas = await Promise.all(
      ranking.map(async ([id, data], i) => {
        const user = await interaction.client.users.fetch(id);
        const medalha = MEDALHAS[i] ?? `**${i + 1}.**`;
        return `${medalha} ${user.username} — ${data.saldo} moedas`;
      })
    );

    await interaction.reply(`🏆 **Ranking**\n\n${linhas.join("\n")}`);
  }
};
