const axios = require('axios');
const config = require('../config.json');
module.exports = {
  name: 'joke',
  async execute(message, args) {
    try {

      const response = await axios.get('https://api.api-ninjas.com/v1/jokes', {
        headers: {
          'X-Api-Key': `${config.api_ninjas_key}`,
        }
      });

      const joke = response.data[0]?.joke;

      if (joke) {

        await message.channel.send(`\`\`\`${joke}\`\`\``);
      } else {
        await message.channel.send("Sorry, I couldn't fetch a joke at the moment.");
      }
    } catch (err) {
      console.error('Error fetching joke:', err);
      await message.channel.send("There was an error fetching a joke.");
    }
  },
};