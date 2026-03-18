require("dotenv").config();
const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once("clientReady", () => {
  console.log("Bot online!");
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
    const caos = player.dados.find(d => d !== lei);

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
      game.jogadores.forEach(p => {
        const nome = p.isBot ? "COP (bot)" : p.user.username;
        desc += `${nome} → Lei: **${p.lei}** | Caos: **${p.caos}**\n`;
      });

      if (resultado.tipo === "todos_perdem") {
        desc += "\n💀 Todos perderam!";
      } else {
        const nome = resultado.vencedor.isBot ? "COP (bot)" : resultado.vencedor.user.username;
        desc += `\n🏆 Vencedor: **${nome}**`;
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

