require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages]
});

client.once("clientReady", () => {
  console.log("Bot online!");
});

client.on("interactionCreate", async interaction => {
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

