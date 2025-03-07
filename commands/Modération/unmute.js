const { PermissionFlagsBits, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "unmute",
  description: "🔊 Retire le timeout d'un utilisateur.",
  usage: "<@utilisateur / ID de l'utilisateur>",
  permissions: PermissionFlagsBits.ModerateMembers,
  async execute(message, args) {
    try {
      // Vérification des permissions
      if (
        !message.member.permissions.has(PermissionFlagsBits.ModerateMembers)
      ) {
        return message.reply(
          "❌ Vous n'avez pas la permission de retirer un timeout."
        );
      }
      if (
        !message.guild.members.me.permissions.has(
          PermissionFlagsBits.ModerateMembers
        )
      ) {
        return message.reply(
          "❌ Je n'ai pas la permission de retirer un timeout !"
        );
      }

      // Vérification du membre à unmute (mention ou ID)
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
        return message.reply("❌ Vous ne pouvez pas vous unmute vous-même !");
      if (target.id === message.guild.ownerId)
        return message.reply(
          "❌ Impossible de unmute le propriétaire du serveur !"
        );
      if (
        message.member.roles.highest.position <= target.roles.highest.position
      ) {
        return message.reply(
          "❌ Vous ne pouvez pas unmute un membre ayant un rôle égal ou supérieur au vôtre !"
        );
      }
      if (
        message.guild.members.me.roles.highest.position <=
        target.roles.highest.position
      ) {
        return message.reply(
          "❌ Je ne peux pas unmute ce membre car son rôle est supérieur ou égal au mien !"
        );
      }

      // Vérifier si l'utilisateur est en timeout
      if (!target.communicationDisabledUntilTimestamp) {
        return message.reply("❌ Cet utilisateur n'est pas en timeout !");
      }

      // Retirer le timeout
      await target.timeout(null);

      // Création de l'embed
      const unmuteEmbed = new EmbedBuilder()
        .setColor("#00FF00")
        .setTitle("🔊 UNMUTE | Fin du timeout")
        .setDescription(
          `
\`\`\`
👤 Utilisateur :    ${target.user.tag} (ID: ${target.id})
🛠️ Modérateur :   ${message.author.tag}
📆 Date :         ${new Date().toLocaleString()}

🎙️ ${target.user.tag} peut à nouveau parler librement !
\`\`\`
        `
        )
        .setFooter({ text: "Commande exécutée avec succès" })
        .setTimestamp();

      // Envoi de l'embed avec les informations du unmute
      message.channel.send({ embeds: [unmuteEmbed] });
    } catch (error) {
      console.error(error);
      message.reply(
        "❌ Une erreur est survenue lors de l'exécution de la commande."
      );
    }
  },
};
