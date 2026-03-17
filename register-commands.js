require("dotenv").config();
const { REST, Routes } = require("discord.js");
const fs = require("fs");
const path = require("path");

const { TOKEN, CLIENT_ID, GUILD_ID } = process.env;

if (!TOKEN || !CLIENT_ID || !GUILD_ID) {
  console.error("❌ Faltando TOKEN, CLIENT_ID ou GUILD_ID no .env");
  process.exit(1);
}

// Carrega automaticamente todos os comandos da pasta /commands
const commandsPath = path.join(__dirname, "commands");
const commands = fs
  .readdirSync(commandsPath)
  .filter(f => f.endsWith(".js"))
  .map(f => {
    const command = require(path.join(commandsPath, f));
    console.log(`📦 Carregado: /${command.data.name}`);
    return typeof command.data.toJSON === "function"
      ? command.data.toJSON()
      : command.data;
  });

const rest = new REST({ version: "10" }).setToken(TOKEN);

(async () => {
  try {
    console.log(`\nRegistrando ${commands.length} comando(s) no servidor ${GUILD_ID}...`);

    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), // guild = instantâneo
      { body: commands }
    );

    console.log("✅ Comandos registrados com sucesso!\n");
    commands.forEach(c => console.log(`  /${c.name}`));
  } catch (error) {
    console.error("❌ Erro ao registrar comandos:", error);
  }
})();
