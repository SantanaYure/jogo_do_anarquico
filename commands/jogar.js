const { getGame, rollForPlayers, chooseForBot } = require("../game");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function animarDados(channel, player, d1, d2) {
  const msg = await channel.send(`🎲 ${player.user.username} está rolando os dados...`);

  const faces = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣"];

  for (let i = 0; i < 3; i++) {
    const fake = faces[Math.floor(Math.random() * 6)];
    await sleep(500);
    await msg.edit(`🎲 ${player.user.username} rolando... ${fake}`);
  }

  await sleep(500);
  await msg.edit(`🎲 ${player.user.username} rolou: **${d1}** e **${d2}**`);
}

module.exports = {
  data: {
    name: "jogar",
    description: "Inicia a rodada"
  },

  async execute(interaction) {
    const game = getGame(interaction.channelId);

    if (!game) return interaction.reply("Sem jogo.");

    rollForPlayers(game);
    game.status = "playing";

    // Bots escolhem automaticamente
    game.jogadores.forEach(p => {
      if (p.isBot) chooseForBot(p);
    });

    await interaction.reply("🌀 Os dados estão sendo lançados...");

    for (const p of game.jogadores) {
      const [d1, d2] = p.dados;

      if (p.isBot) continue;

      await animarDados(interaction.channel, p, d1, d2);

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId(`lei_${d1}_${p.id}`)
          .setLabel(`Lei = ${d1}`)
          .setStyle(ButtonStyle.Primary),

        new ButtonBuilder()
          .setCustomId(`lei_${d2}_${p.id}`)
          .setLabel(`Lei = ${d2}`)
          .setStyle(ButtonStyle.Secondary)
      );

      const embed = new EmbedBuilder()
        .setTitle("🎲 Jogo do Anárquico")
        .setDescription(`**${p.user.username}**, seus dados:\n🎲 **${d1}** e 🎲 **${d2}**`)
        .setColor("#5865F2")
        .setFooter({ text: "Escolha sua Lei" });

      await interaction.channel.send({ embeds: [embed], components: [row] });
    }
  }
};
