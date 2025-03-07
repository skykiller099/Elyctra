const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "botinfo",
  description: "ℹ️ Affiche les informations détaillées sur le bot.",
  usage: "",
  async execute(message) {
    try {
      // Récupération des informations du bot
      const botUser = message.client.user;
      const uptime = process.uptime(); // Temps d'activité du bot en secondes
      const totalMembers = message.client.guilds.cache.reduce(
        (acc, guild) => acc + guild.memberCount,
        0
      );
      const botCreationDate = botUser.createdAt.toLocaleDateString();
      const botId = botUser.id;
      const botVersion = "1.0.0"; // Remplace par la version actuelle du bot
      const botShard = message.client.shard ? message.client.shard.count : 1; // Nombre de shards du bot
      const totalGuilds = message.client.guilds.cache.size; // Nombre total de serveurs

      // Création de l'embed avec les informations du bot
      const botInfoEmbed = new EmbedBuilder()
        .setColor("#0099FF")
        .setTitle("ℹ️ Informations sur le Bot")
        .setDescription(
          `
\`\`\`
🛠️ Configuration :

🤖 Nom du Bot :     ${botUser.username}
🆔 ID du Bot :      ${botId}
🛠️ Version du Bot : ${botVersion}
🔢 Shard du Bot:   Shard ${
            message.client.shard ? message.client.shard.ids[0] + 1 : 1
          } / ${botShard}
          \n\n
🔍 Utilisation :

👥 Total Membres :  ${totalMembers} membres sur tous les serveurs
🌐 Total Serveurs : ${totalGuilds} serveurs
📅 Création du Bot : ${botCreationDate}
⏱️ Temps d'activité : ${formatUptime(uptime)}
👨‍💻 Créateur : ๖̶ζ͜͡Skykiller | <@1219371934999904388>
\`\`\`
        `
        )
        .setFooter({ text: "Commande exécutée avec succès" })
        .setTimestamp();

      // Envoi de l'embed
      message.channel.send({ embeds: [botInfoEmbed] });
    } catch (error) {
      console.error(error);
      message.reply(
        "❌ Une erreur est survenue lors de l'exécution de la commande."
      );
    }
  },
};

// Fonction pour formater le temps d'activité du bot (en secondes)
function formatUptime(seconds) {
  const days = Math.floor(seconds / (3600 * 24));
  const hours = Math.floor((seconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const sec = Math.floor(seconds % 60);

  return `${days}j ${hours}h ${minutes}m ${sec}s`;
}
