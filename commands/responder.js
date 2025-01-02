const fs = require('fs');
const path = require('path');
const responderFilePath = path.join(__dirname, '../responder.json');

module.exports = {
  name: 'responder',
  async execute(message, args) {
    if (args.length < 2) {
      return message.channel.send('Please provide a trigger and a response.');
    }

    const trigger = args[0].toLowerCase().trim();  // Normalize the trigger (to lowercase and trim spaces)
    const response = args.slice(1).join(' ');

    try {
      const responderData = JSON.parse(fs.readFileSync(responderFilePath, 'utf-8'));

      responderData[trigger] = response;

      fs.writeFileSync(responderFilePath, JSON.stringify(responderData, null, 2));

      return message.channel.send(`\`\`\`diff\n+ Responder added:\n+ Trigger: ${trigger}\n+ Response: ${response}\n\`\`\``);
    } catch (error) {
      console.error('Error saving response:', error);
      return message.channel.send('There was an error adding the response.');
    }
  },
};
