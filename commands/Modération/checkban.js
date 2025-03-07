const { PermissionFlagsBits, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "checkban",
  description:
    "🔍 Vérifie si un utilisateur est banni du serveur et affiche les informations disponibles.",
  usage: "<@utilisateur / ID de l'utilisateur>",
  permissions: PermissionFlagsBits.BanMembers,
  async execute(message, args) {
    try {
      // Vérification des permissions
      if (!message.member.permissions.has(PermissionFlagsBits.BanMembers)) {
        return message.reply(
          "❌ Vous n'avez pas la permission de vérifier les bans !"
        );
      }

      // Vérification que l'utilisateur a fourni un ID ou une mention
      let userToCheck;
      if (args.length > 0) {
        const userId = args[0]; // L'ID fourni par l'utilisateur
        userToCheck = await message.guild.members
          .fetch(userId)
          .catch(() => null);
      }

      // Si l'utilisateur n'est pas trouvé, essayer de chercher avec l'ID
      if (!userToCheck) {
        const userId = args[0];
        const bans = await message.guild.bans.fetch();
        const banInfo = bans.get(userId);

        if (!banInfo) {
          return message.reply(
            `❌ Aucun bannissement trouvé pour l'utilisateur avec l'ID ${userId}.`
          );
        }

        // Préparation du message avec les informations du bannissement
        const { user, reason, date, executor } = banInfo;

        const checkBanEmbed = new EmbedBuilder()
          .setColor("#FF0000")
          .setTitle("🔍 Informations sur le bannissement")
          .setDescription(
            `
\`\`\`
🛑 Utilisateur : ${user.tag} (${user.id})
📅 Date du bannissement : ${date.toLocaleString()}
❗ Raison : ${reason || "Aucune raison fournie"}

🛠️ Action effectuée par : ${executor.tag}
📆 Date du bannissement : ${date.toLocaleString()}
\`\`\`
          `
          )
          .setFooter({ text: "Commande exécutée avec succès" })
          .setTimestamp();

        // Envoi du message avec les informations du bannissement
        return message.channel.send({ embeds: [checkBanEmbed] });
      } else {
        return message.reply(
          "❌ Veuillez fournir un ID valide ou mentionner un utilisateur !"
        );
      }
    } catch (error) {
      console.error(error);
      message.reply(
        "❌ Une erreur est survenue lors de l'exécution de la commande."
      );
    }
  },
};
