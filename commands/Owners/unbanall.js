const { PermissionFlagsBits } = require("discord.js");

module.exports = {
  name: "unbanall",
  description: "🚨 Débannit tous les utilisateurs bannis du serveur.",
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
          PermissionFlagsBits.BanMembers
        )
      ) {
        return message.reply(
          "❌ Je n'ai pas la permission de débannir des membres !"
        );
      }

      // Récupérer la liste des bans
      const bans = await message.guild.bans.fetch();
      if (bans.size === 0) {
        return message.reply(
          "❌ Aucun utilisateur n'est banni sur ce serveur."
        );
      }

      // Envoi du message initial avec un statut "en cours"
      let progressMessage = await message.channel.send(`
\`\`\`
🚨 UNBAN ALL | Démarrage...

🔢 Utilisateurs à débannir : ${bans.size}
⏳ Progression : 0% (0/${bans.size})
🛠️ Modérateur : ${message.author.tag}
📆 Date : ${new Date().toLocaleString()}

⚠️ Merci de patienter...
\`\`\`
            `);

      // Débannir tous les utilisateurs avec mise à jour en temps réel
      let unbannedCount = 0;
      for (const ban of bans.values()) {
        await message.guild.bans.remove(ban.user.id).catch(() => null);
        unbannedCount++;

        // Mise à jour du message toutes les 5 bans ou à la fin
        if (unbannedCount % 3 === 0 || unbannedCount === bans.size) {
          let progress = Math.round((unbannedCount / bans.size) * 100);
          await progressMessage.edit(`
\`\`\`
🚨 UNBAN ALL | En cours...

🔢 Utilisateurs à débannir : ${bans.size}
✅ Débannis : ${unbannedCount}/${bans.size} (${progress}%)
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
🚨 UNBAN ALL | Terminé !

🔢 Nombre total d'utilisateurs débannis : ${unbannedCount}
🛠️ Action effectuée par : ${message.author.tag}
📆 Date : ${new Date().toLocaleString()}

✅ Tous les utilisateurs ont été débannis avec succès !
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
