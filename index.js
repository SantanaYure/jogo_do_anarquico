require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");

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
      const resultado = resolveGame(game);

      let msg = "🎲 **RESULTADOS:**\n";
      game.jogadores.forEach(p => {
        const nome = p.isBot ? "COP (bot)" : p.user.username;
        msg += `${nome} → Lei: ${p.lei} | Caos: ${p.caos}\n`;
      });

      if (resultado.tipo === "todos_perdem") {
        msg += "\n💀 Todos perderam!";
      } else {
        const nome = resultado.vencedor.isBot ? "COP (bot)" : resultado.vencedor.user.username;
        msg += `\n🏆 Vencedor: **${nome}**`;
      }

      await interaction.channel.send(msg);
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

