const { getGame, allChosen, resolveGame } = require("../game");
const { addMoney } = require("../economy");

module.exports = {
  data: {
    name: "escolher",
    description: "Escolher Lei e Caos",
    options: [
      { name: "lei", type: 4, description: "Valor do dado para Lei", required: true },
      { name: "caos", type: 4, description: "Valor do dado para Caos", required: true }
    ]
  },

  async execute(interaction) {
    const game = getGame(interaction.channelId);

    if (!game) return interaction.reply("Sem jogo.");

    const player = game.jogadores.find(p => p.id === interaction.user.id);

    if (!player) return interaction.reply("Você não está no jogo.");

    const lei = interaction.options.getInteger("lei");
    const caos = interaction.options.getInteger("caos");

    if (!player.dados.includes(lei) || !player.dados.includes(caos) || lei === caos) {
      return interaction.reply({ content: "❌ Escolha inválida.", ephemeral: true });
    }

    player.lei = lei;
    player.caos = caos;

    await interaction.reply({ content: "✅ Escolha registrada!", ephemeral: true });

    if (allChosen(game)) {
      const resultado = resolveGame(game);

      // Busca os usernames de todos os jogadores
      const users = {};
      for (const p of game.jogadores) {
        users[p.id] = await interaction.client.users.fetch(p.id);
      }

      let msg = "";

      if (resultado.invertidos.length > 0) {
        msg += "🔄 **INVERSÃO DE DADOS:**\n";
        resultado.invertidos.forEach(({ id, valorCaos, total }) => {
          msg += `⚡ ${users[id].username} — Caos ${valorCaos} (${total} jogador${total > 1 ? "es" : ""}, ímpar) → dados invertidos!\n`;
        });
        msg += "\n";
      }

      msg += "🎲 **RESULTADOS FINAIS:**\n";
      game.jogadores.forEach(p => {
        msg += `${users[p.id].username} → Lei: ${p.lei} | Caos: ${p.caos}\n`;
      });

      if (resultado.tipo === "todos_perdem") {
        msg += "\n💀 Todos perderam! Empate no Caos — o caos absorveu tudo. 😈";
      } else {
        const premio = game.aposta * game.jogadores.length;
        addMoney(resultado.vencedor.id, premio);
        msg += `\n🏆 Vencedor: **${users[resultado.vencedor.id].username}** com Caos ${resultado.vencedor.caos} (+${premio} moedas)`;
      }

      await interaction.channel.send(msg);
    }
  }
};
