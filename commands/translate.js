const axios = require('axios');

module.exports = {
  name: 'translate',
  async execute(message, args) {
    const targetLang = args[0];
    const text = args.slice(1).join(' ');
    
    if (!targetLang || !text) {
      return message.channel.send('```Usage: translate <target-language-code> <text>```');
    }

    try {
      const { data } = await axios.get(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=auto|${targetLang}`);
      message.channel.send(`\`\`\`Translated to ${targetLang}: ${data.responseData.translatedText}\`\`\``);
    } catch (error) {
      message.channel.send('```Could not translate the text.```');
    }
  }
};
