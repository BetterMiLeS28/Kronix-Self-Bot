const axios = require('axios');

module.exports = {
  name: 'define',
  async execute(message, args) {
    if (!args.length) {
      return message.channel.send('```Please provide a word to define.```');
    }

    const word = args.join(' ');
    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

    try {
      const response = await axios.get(url);
      const wordData = response.data[0];
      
      if (wordData) {
        const definition = wordData.meanings[0].definitions[0].definition;
        const example = wordData.meanings[0].definitions[0].example || 'No example available.';
        
        return message.channel.send(
          `**Word:** ${word}\n` +
          `**Definition:** ${definition}\n` +
          `**Example:** ${example}`
        );
      } else {
        return message.channel.send('```Word not found.```');
      }
    } catch (error) {
      console.error(error);
      return message.channel.send('```Check the Spelling Idiot.```');
    }
  }
};
