const { PermissionFlagsBits, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "ban",
  description: "🚨 Bannit un utilisateur du serveur.",
  usage: "<@utilisateur / ID de l'utilisateur> [raison]",
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

      // Vérification de l'utilisateur à bannir (mention ou ID)
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

      // Création de l'embed avec les informations de bannissement
      const banEmbed = new EmbedBuilder()
        .setColor("#FF0000")
        .setTitle("🔨 Bannissement effectué")
        .setDescription(
          `
\`\`\`
👤 Utilisateur :    ${target.user.tag} (ID: ${target.id})
📜 Raison :        ${reason}
🛠️ Modérateur :   ${message.author.tag}
📆 Date :         ${new Date().toLocaleString()}

🚷 ${target.user.tag} a été banni avec succès !
\`\`\`
        `
        )
        .setFooter({ text: "Commande exécutée avec succès" })
        .setTimestamp();

      // Envoi de l'embed dans le canal
      message.channel.send({ embeds: [banEmbed] });
    } catch (error) {
      console.error(error);
      message.reply(
        "❌ Une erreur est survenue lors de l'exécution de la commande."
      );
    }
  },
};
