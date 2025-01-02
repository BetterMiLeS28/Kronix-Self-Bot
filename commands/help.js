const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'help',
  async execute(message, args, config) {
    const commandsDir = path.join(__dirname, '../commands');
    const commandFiles = fs.readdirSync(commandsDir).filter(file => file.endsWith('.js'));

    if (args.length > 0) {
      const commandName = args[0].toLowerCase();
      const commandFile = commandFiles.find(file => file.replace('.js', '') === commandName);

      if (commandFile) {
        const command = require(path.join(commandsDir, commandFile));
        let response = `\`\`\`yaml\nCommand: ${command.name}\nDescription: ${command.description || 'No description available'}\nUsage: ${command.usage || 'No usage information available'}\`\`\``;

        if (command.attack) {
          response += '\n**This command is marked as an attack command.**';
        }

        const reply = await message.channel.send(response);
        setTimeout(() => reply.delete(), 5000); // Delete after 5 seconds

      } else {
        const reply = await message.channel.send('`❕ Command not found.`');
        setTimeout(() => reply.delete(), 5000); // Delete after 5 seconds
      }
      
    } else {
      let regularCommands = [];
      let attackCommands = [];

      commandFiles.forEach(file => {
        const command = require(path.join(commandsDir, file));
        if (command.attack) {
          attackCommands.push(command.name + ' (attack)');
        } else {
          regularCommands.push(command.name);
        }
      });

      let response = `\`\`\`yml\nHelp Menu:\n\n+ Regular Commands:\n\`${regularCommands.join(', ')}\``;

      if (attackCommands.length > 0) {
        response += `\n\n+ Attack Commands:\n\`${attackCommands.join(', ')} \n⁑ ⚠️ Use attack commands responsibly.\`\`\``;
      }

      const reply = await message.channel.send({content: `## [Kronix v1](https://media.discordapp.net/attachments/1278007019185639597/1278266682414075926/Copy_of_arisa_1.gif?ex=674c1b1e&is=674ac99e&hm=3392a8f56a5d7c7c4c3d59714783f3483ceac7ab9314f1a1428d64b26db6b14f&=)\n ${response}`});
      setTimeout(() => reply.delete(), 30000); // Delete after 5 seconds
    }
  }
};
