require("dotenv").config();
const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once("clientReady", () => {
  console.log("Bot online!");
  require("./economy").startDailyIncome();
});

client.on("interactionCreate", async interaction => {
  if (interaction.isButton()) {
    const [, valor, playerId] = interaction.customId.split("_");

    const game = require("./game").getGame(interaction.channelId);

    if (!game) {
      return interaction.reply({ content: "Sem jogo ativo.", ephemeral: true });
    }

    if (interaction.user.id !== playerId) {
      return interaction.reply({ content: "❌ Esse botão não é seu!", ephemeral: true });
    }

    const player = game.jogadores.find(p => p.id === playerId);

    const lei = Number(valor);
    const idx = player.dados.indexOf(lei);
    const caos = player.dados[idx === 0 ? 1 : 0];

    player.lei = lei;
    player.caos = caos;

    await interaction.reply({
      content: `✅ Você escolheu Lei: **${lei}** | Caos: **${caos}**`,
      ephemeral: true
    });

    const { allChosen, resolveGame } = require("./game");

    if (allChosen(game)) {
      await interaction.channel.send("🌀 O destino está sendo decidido...");
      await new Promise(r => setTimeout(r, 1500));
      await interaction.channel.send("⚖️ Lei e Caos entram em conflito...");
      await new Promise(r => setTimeout(r, 1500));

      const resultado = resolveGame(game);

      let desc = "";

      if (resultado.invertidos.length > 0) {
        desc += "🔄 **Inversões:**\n";
        resultado.invertidos.forEach(({ id, valorCaos, total }) => {
          const p = game.jogadores.find(j => j.id === id);
          const nome = p.isBot ? "COP (bot)" : p.user.username;
          desc += `⚡ ${nome} — Caos ${valorCaos} (${total} jogador${total > 1 ? "es" : ""}, ímpar) → invertido!\n`;
        });
        desc += "\n";
      }

      game.jogadores.forEach(p => {
        const nome = p.isBot ? "COP (bot)" : p.user.username;
        desc += `${nome} → Lei: **${p.lei}** | Caos: **${p.caos}**\n`;
      });

      if (resultado.tipo === "todos_perdem") {
        desc += "\n💀 Todos perderam!";
      } else {
        const nome = resultado.vencedor.isBot ? "COP (bot)" : resultado.vencedor.user.username;
        desc += `\n🏆 Vencedor: **${nome}** com Caos ${resultado.vencedor.caos}`;
      }

      const resultadoEmbed = new EmbedBuilder()
        .setTitle("🏆 Resultado Final")
        .setDescription(desc)
        .setColor("#FFD700");

      await interaction.channel.send({ embeds: [resultadoEmbed] });
    }

    return;
  }

  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;

  try {
    const command = require(`./commands/${commandName}.js`);
    await command.execute(interaction);
  } catch (error) {
    console.error("Erro ao executar comando:", error);
    interaction.reply("❌ Erro ao executar comando.");
  }
});

client.login(process.env.TOKEN);

