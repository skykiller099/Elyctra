const { PermissionFlagsBits } = require("discord.js");

module.exports = {
  name: "clearmax",
  description: "🧹 Supprime tous les messages jusqu'à 14 jours dans le salon.",
  usage: "",
  permissions: PermissionFlagsBits.ManageMessages,
  async execute(message) {
    try {
      // Vérification des permissions
      if (!message.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
        return message.reply(
          "❌ Vous n'avez pas la permission de gérer les messages !"
        );
      }
      if (
        !message.guild.members.me.permissions.has(
          PermissionFlagsBits.ManageMessages
        )
      ) {
        return message.reply(
          "❌ Je n'ai pas la permission de supprimer des messages !"
        );
      }

      // Variables pour suivre la suppression et la progression
      let totalDeleted = 0;
      let deletedMessages = [];
      let progressMessage = await message.channel.send(`
\`\`\`
🧹 CLEARMAX | Démarrage...

🔢 Messages à supprimer : En attente...
⏳ Progression : 0%
🛠️ Modérateur : ${message.author.tag}
📆 Date : ${new Date().toLocaleString()}
\`\`\`
            `);

      // Boucle pour récupérer et supprimer les messages
      let messagesFetched;
      do {
        // Récupère les 100 derniers messages
        messagesFetched = await message.channel.messages.fetch({ limit: 100 });
        const recentMessages = messagesFetched.filter(
          (m) => Date.now() - m.createdTimestamp <= 1209600000
        ); // Messages de moins de 14 jours

        if (recentMessages.size > 0) {
          // Ajout des messages à supprimer à la liste
          deletedMessages.push(...recentMessages.values());
          totalDeleted += recentMessages.size;

          // Suppression des messages récupérés
          await message.channel.bulkDelete(recentMessages, true);

          // Mise à jour du message de progression
          let progress = Math.round(
            (totalDeleted / (totalDeleted + messagesFetched.size)) * 100
          );
          await progressMessage.edit(`
\`\`\`
🧹 CLEARMAX | Suppression en cours...

🔢 Messages supprimés : ${totalDeleted}
⏳ Progression : ${progress}% (${totalDeleted}/${messagesFetched.size})
🛠️ Modérateur : ${message.author.tag}
📆 Date : ${new Date().toLocaleString()}
\`\`\`
                    `);
        }
      } while (
        messagesFetched.size === 100 &&
        messagesFetched.some(
          (m) => Date.now() - m.createdTimestamp <= 1209600000
        )
      );

      // Mise à jour finale
      await progressMessage.edit(`
\`\`\`
🧹 CLEARMAX | Terminé !

🔢 Nombre total de messages supprimés : ${totalDeleted}
🛠️ Action effectuée par : ${message.author.tag}
📆 Date : ${new Date().toLocaleString()}

✅ Tous les messages jusqu'à 14 jours ont été supprimés avec succès !
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
