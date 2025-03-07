const { PermissionFlagsBits, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "unban",
  description: "✅ Débannit un utilisateur du serveur.",
  usage: "<ID de l'utilisateur / @utilisateur> [raison]",
  permissions: PermissionFlagsBits.BanMembers,
  async execute(message, args) {
    try {
      // Vérification des permissions
      if (!message.member.permissions.has(PermissionFlagsBits.BanMembers)) {
        return message.reply(
          "❌ Vous n'avez pas la permission de débannir des membres."
        );
      }
      if (
        !message.guild.members.me.permissions.has(
          PermissionFlagsBits.BanMembers
        )
      ) {
        return message.reply(
          "❌ Je n'ai pas la permission de débannir des membres !"
        );
      }

      // Vérification de l'ID ou de la mention
      let target;
      if (args.length > 0) {
        // Si un ID est fourni, tenter de récupérer l'utilisateur
        const userId = args[0];
        target = await message.guild.members.fetch(userId).catch(() => null);
        if (!target) {
          return message.reply(
            "❌ Utilisateur introuvable. Veuillez fournir un ID valide ou mentionner un utilisateur."
          );
        }
      } else {
        return message.reply(
          "❌ Veuillez mentionner un utilisateur ou fournir un ID valide."
        );
      }

      // Vérifier si l'utilisateur est banni
      const bans = await message.guild.bans.fetch();
      const bannedUser = bans.get(target.id);

      if (!bannedUser) {
        return message.reply("❌ Cet utilisateur n'est pas banni.");
      }

      // Raison du déban
      const reason = args.slice(1).join(" ") || "Aucune raison spécifiée.";

      // Débannissement
      await message.guild.bans.remove(target.id, reason);

      // Création de l'embed
      const unbanEmbed = new EmbedBuilder()
        .setColor("#00FF00")
        .setTitle("✅ UNBAN | Levée de sanction")
        .setDescription(
          `
\`\`\`
👤 Utilisateur :    ${bannedUser.user.tag} (ID: ${bannedUser.user.id})
📜 Raison :        ${reason}
🛠️ Modérateur :   ${message.author.tag}
📆 Date :         ${new Date().toLocaleString()}

🎉 ${bannedUser.user.tag} a été débanni avec succès !
\`\`\`
        `
        )
        .setFooter({ text: "Commande exécutée avec succès" })
        .setTimestamp();

      // Envoi de l'embed avec les informations du déban
      message.channel.send({ embeds: [unbanEmbed] });
    } catch (error) {
      console.error(error);
      message.reply(
        "❌ Une erreur est survenue lors de l'exécution de la commande."
      );
    }
  },
};
