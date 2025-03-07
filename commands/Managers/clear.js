const { PermissionFlagsBits } = require("discord.js");

module.exports = {
  name: "clear",
  description: "🧹 Supprime un certain nombre de messages dans le salon.",
  usage: "<nombre de messages>",
  permissions: PermissionFlagsBits.ManageMessages,
  async execute(message, args) {
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

      // Vérification du nombre de messages à supprimer
      const amount = parseInt(args[0], 10);
      if (isNaN(amount) || amount < 1 || amount > 100) {
        return message.reply(
          "❌ Vous devez spécifier un nombre de messages à supprimer entre 1 et 100."
        );
      }

      // Suppression des messages
      const deletedMessages = await message.channel.bulkDelete(amount, true);
      if (deletedMessages.size === 0) {
        return message.reply("❌ Aucun message à supprimer.");
      }

      // Message ultra stylé
      const clearMessage = `
\`\`\`
🧹 CLEAR | Suppression de messages

🔢 Nombre de messages supprimés : ${deletedMessages.size}
🛠️ Action effectuée par : ${message.author.tag}
📆 Date : ${new Date().toLocaleString()}

✅ Les messages ont été supprimés avec succès !
\`\`\`
            `;
      message.channel.send(clearMessage).then((msg) => {
        setTimeout(() => msg.delete(), 5000); // Supprime le message après 5 secondes
      });
    } catch (error) {
      console.error(error);
      message.reply(
        "❌ Une erreur est survenue lors de l'exécution de la commande."
      );
    }
  },
};
