const fs = require('fs');
const { log } = require('../helpers/log');

module.exports = (interaction, client) => {
  if (!interaction.isCommand()) return;

  const command = interaction.commandName.toLowerCase();
  const args = interaction.options._hoistedOptions;

  fs.readdir(`${__dirname}/../commands`, (err, files) => {
    if (err) log('error', err.message);

    files.map(async file => {
      if (!file.endsWith('.js')) return;
      const commandName = file.replace('.js', '');
      const commandFile = require(`${__dirname}/../commands/${file}`);

      if (command === commandName) {
        if (!client.application?.owner) await client.application?.fetch();
        if (commandFile.permission && !interaction.member.permissions.has(commandFile.permission)) {
          return await interaction.reply(`**${interaction.member.user.username}**, vous n'avez pas la permission d'utiliser cette commande`)
        }

        await commandFile.run(interaction, client, args, false);
      }
    });
  });
}