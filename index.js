require("dotenv").config();
const {
  Client,
  GatewayIntentBits,
  Collection,
  ActivityType,
} = require("discord.js");
const fs = require("fs");
const path = require("path");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent,
  ],
});

client.commands = new Collection();
const prefix = process.env.PREFIX || ".";

// Chargement des commandes
const loadCommands = (dir = "commands") => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      loadCommands(fullPath);
    } else if (file.endsWith(".js")) {
      const command = require(`./${fullPath}`);
      if (command.name) {
        client.commands.set(command.name, command);
      }
    }
  }
};
loadCommands();

// Gestion des messages
client.on("messageCreate", async (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();
  const command = client.commands.get(commandName);

  if (command) {
    try {
      await command.execute(message, args);
    } catch (error) {
      console.error(error);
      message.reply(
        "Une erreur est survenue lors de l'exécution de la commande."
      );
    }
  }
});

// Statut du bot
client.once("ready", () => {
  console.log(`Connecté en tant que ${client.user.tag}`);
  client.user.setActivity("Gère vos serveurs", { type: ActivityType.Watching });
});

client.login(process.env.TOKEN);
