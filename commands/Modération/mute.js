const { PermissionFlagsBits, TimeSpan } = require("discord.js");

module.exports = {
  name: "mute",
  description: "🔇 Met un utilisateur en timeout (mute temporaire).",
  usage: "<@utilisateur> <durée> [raison]",
  permissions: PermissionFlagsBits.ModerateMembers,
  async execute(message, args) {
    try {
      // Vérification des permissions
      if (
        !message.member.permissions.has(PermissionFlagsBits.ModerateMembers)
      ) {
        return message.reply(
          "❌ Vous n'avez pas la permission de mettre en timeout des membres."
        );
      }
      if (
        !message.guild.members.me.permissions.has(
          PermissionFlagsBits.ModerateMembers
        )
      ) {
        return message.reply(
          "❌ Je n'ai pas la permission de mettre en timeout des membres !"
        );
      }

      // Vérification du membre à mute
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
        return message.reply("❌ Vous ne pouvez pas vous mute vous-même !");
      if (target.id === message.guild.ownerId)
        return message.reply(
          "❌ Impossible de mute le propriétaire du serveur !"
        );
      if (
        message.member.roles.highest.position <= target.roles.highest.position
      ) {
        return message.reply(
          "❌ Vous ne pouvez pas mute un membre ayant un rôle égal ou supérieur au vôtre !"
        );
      }
      if (
        message.guild.members.me.roles.highest.position <=
        target.roles.highest.position
      ) {
        return message.reply(
          "❌ Je ne peux pas mute ce membre car son rôle est supérieur ou égal au mien !"
        );
      }

      // Vérification de la durée
      const duration = args[1];
      if (!duration || isNaN(TimeSpan.parse(duration))) {
        return message.reply(
          "❌ Veuillez spécifier une durée valide (ex: `10m`, `1h`, `2d`)."
        );
      }
      const timeoutMs = TimeSpan.parse(duration);

      // Raison du mute
      const reason = args.slice(2).join(" ") || "Aucune raison spécifiée.";

      // Application du timeout
      await target.timeout(timeoutMs, reason);

      // Message ultra stylé
      const muteMessage = `
\`\`\`
🔇 MUTE | Timeout appliqué

👤 Utilisateur :    ${target.user.tag} (ID: ${target.id})
⏳ Durée :         ${duration}
📜 Raison :        ${reason}
🛠️ Modérateur :   ${message.author.tag}
📆 Date :         ${new Date().toLocaleString()}

🚫 ${target.user.tag} est maintenant en timeout !
\`\`\`
            `;
      message.channel.send(muteMessage);
    } catch (error) {
      console.error(error);
      message.reply(
        "❌ Une erreur est survenue lors de l'exécution de la commande."
      );
    }
  },
};
