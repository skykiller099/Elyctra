const { PermissionFlagsBits } = require("discord.js");

module.exports = {
  name: "unban",
  description: "✅ Débannit un utilisateur du serveur.",
  usage: "<ID de l'utilisateur> [raison]",
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

      // Vérification de l'ID
      const userId = args[0];
      if (!userId || isNaN(userId)) {
        return message.reply("❌ Veuillez fournir un ID utilisateur valide.");
      }

      // Vérifier si l'utilisateur est bien banni
      const bans = await message.guild.bans.fetch();
      const bannedUser = bans.get(userId);

      if (!bannedUser) {
        return message.reply("❌ Cet utilisateur n'est pas banni.");
      }

      // Raison du déban
      const reason = args.slice(1).join(" ") || "Aucune raison spécifiée.";

      // Débannissement
      await message.guild.bans.remove(userId, reason);

      // Message ultra stylé
      const unbanMessage = `
\`\`\`
✅ UNBAN | Levée de sanction

👤 Utilisateur :    ${bannedUser.user.tag} (ID: ${bannedUser.user.id})
📜 Raison :        ${reason}
🛠️ Modérateur :   ${message.author.tag}
📆 Date :         ${new Date().toLocaleString()}

🎉 ${bannedUser.user.tag} a été débanni avec succès !
\`\`\`
            `;
      message.channel.send(unbanMessage);
    } catch (error) {
      console.error(error);
      message.reply(
        "❌ Une erreur est survenue lors de l'exécution de la commande."
      );
    }
  },
};
