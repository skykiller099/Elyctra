const { PermissionFlagsBits } = require("discord.js");

module.exports = {
  name: "ban",
  description: "🚨 Bannit un utilisateur du serveur.",
  usage: "<@utilisateur> [raison]",
  permissions: PermissionFlagsBits.BanMembers,
  async execute(message, args) {
    try {
      // Vérification des permissions
      if (!message.member.permissions.has(PermissionFlagsBits.BanMembers)) {
        return message.reply(
          "❌ Vous n'avez pas la permission de bannir des membres."
        );
      }
      if (
        !message.guild.members.me.permissions.has(
          PermissionFlagsBits.BanMembers
        )
      ) {
        return message.reply(
          "❌ Je n'ai pas la permission de bannir des membres !"
        );
      }

      // Récupération du membre à bannir
      const target =
        message.mentions.members.first() ||
        (await message.guild.members.fetch(args[0]).catch(() => null));
      if (!target) {
        return message.reply(
          "❌ Utilisateur introuvable. Mentionnez un membre ou donnez son ID."
        );
      }

      // Vérifications avancées
      if (target.id === message.author.id)
        return message.reply("❌ Vous ne pouvez pas vous bannir vous-même !");
      if (target.id === message.guild.ownerId)
        return message.reply(
          "❌ Impossible de bannir le propriétaire du serveur !"
        );
      if (
        message.member.roles.highest.position <= target.roles.highest.position
      ) {
        return message.reply(
          "❌ Vous ne pouvez pas bannir un membre ayant un rôle égal ou supérieur au vôtre !"
        );
      }
      if (
        message.guild.members.me.roles.highest.position <=
        target.roles.highest.position
      ) {
        return message.reply(
          "❌ Je ne peux pas bannir ce membre car son rôle est supérieur ou égal au mien !"
        );
      }

      // Raison du bannissement
      const reason = args.slice(1).join(" ") || "Aucune raison spécifiée.";

      // Bannissement
      await target.ban({ reason });

      // Message ultra stylé
      const banMessage = `
\`\`\`
🔨 BAN | Expulsion définitive

👤 Utilisateur :    ${target.user.tag} (ID: ${target.id})
📜 Raison :        ${reason}
🛠️ Modérateur :   ${message.author.tag}
📆 Date :         ${new Date().toLocaleString()}

🚷 ${target.user.tag} a été banni avec succès !
\`\`\`
            `;
      message.channel.send(banMessage);
    } catch (error) {
      console.error(error);
      message.reply(
        "❌ Une erreur est survenue lors de l'exécution de la commande."
      );
    }
  },
};
