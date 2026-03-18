// require("dotenv").config();
// const { Client, GatewayIntentBits } = require("discord.js");

// const client = new Client({
//   intents: [GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages]
// });

// client.once("ready", () => {
//   console.log("Bot online!");
// });

// client.on("interactionCreate", async interaction => {
//   if (!interaction.isChatInputCommand()) return;

//   const { commandName } = interaction;

//   const command = require(`./commands/${commandName}.js`);
//   command.execute(interaction);
// });

// client.login(process.env.TOKEN);

require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");

console.log("Iniciando bot...");

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once("ready", () => {
  console.log("Bot online!");
});

client.login(process.env.TOKEN);
