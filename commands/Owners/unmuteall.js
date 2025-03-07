const { PermissionFlagsBits } = require("discord.js");

module.exports = {
  name: "unmuteall",
  description:
    "🔊 Retire le timeout de tous les utilisateurs actuellement mute sur le serveur.",
  usage: "",
  permissions: PermissionFlagsBits.Administrator,
  async execute(message) {
    try {
      // Vérification des permissions
      if (
        message.author.id !== message.guild.ownerId &&
        !message.member.permissions.has(PermissionFlagsBits.Administrator)
      ) {
        return message.reply(
          "❌ Seul le propriétaire du serveur ou un administrateur peut utiliser cette commande."
        );
      }
      if (
        !message.guild.members.me.permissions.has(
          PermissionFlagsBits.ModerateMembers
        )
      ) {
        return message.reply(
          "❌ Je n'ai pas la permission de retirer les timeouts !"
        );
      }

      // Récupération des membres en timeout
      const members = await message.guild.members.fetch();
      const mutedMembers = members.filter(
        (member) => member.communicationDisabledUntilTimestamp
      );

      if (mutedMembers.size === 0) {
        return message.reply(
          "❌ Aucun utilisateur n'est actuellement en timeout sur ce serveur."
        );
      }

      // Envoi du message initial avec un statut "en cours"
      let progressMessage = await message.channel.send(`
\`\`\`
🔊 UNMUTE ALL | Démarrage...

🔢 Utilisateurs en timeout : ${mutedMembers.size}
⏳ Progression : 0% (0/${mutedMembers.size})
🛠️ Modérateur : ${message.author.tag}
📆 Date : ${new Date().toLocaleString()}

⚠️ Merci de patienter...
\`\`\`
            `);

      // Retirer le timeout de tous les utilisateurs avec mise à jour en temps réel
      let unmutedCount = 0;
      for (const member of mutedMembers.values()) {
        await member.timeout(null).catch(() => null);
        unmutedCount++;

        // Mise à jour du message toutes les 5 démutages ou à la fin
        if (unmutedCount % 5 === 0 || unmutedCount === mutedMembers.size) {
          let progress = Math.round((unmutedCount / mutedMembers.size) * 100);
          await progressMessage.edit(`
\`\`\`
🔊 UNMUTE ALL | En cours...

🔢 Utilisateurs en timeout : ${mutedMembers.size}
✅ Démutés : ${unmutedCount}/${mutedMembers.size} (${progress}%)
🛠️ Modérateur : ${message.author.tag}
📆 Date : ${new Date().toLocaleString()}

⏳ Merci de patienter...
\`\`\`
                    `);
        }
      }

      // Mise à jour finale du message
      await progressMessage.edit(`
\`\`\`
🔊 UNMUTE ALL | Terminé !

🔢 Nombre total d'utilisateurs démutes : ${unmutedCount}
🛠️ Action effectuée par : ${message.author.tag}
📆 Date : ${new Date().toLocaleString()}

✅ Tous les utilisateurs ont été démutes avec succès !
\`\`\`
            `);
    } catch (error) {
      console.error(error);
      message.reply(
        "❌ Une erreur est survenue lors de l'exécution de la commande."
      );
    }
  },
};
