const axios = require('axios');

module.exports = {
  name: 'meme',
  async execute(message) {
    try {

      const response = await axios.get('https://meme-api.com/gimme');

      const { postLink, subreddit, title, url, author, ups, preview } = response.data;

      const memeMessage = `
**Title**: ${title}
**Subreddit**: ${subreddit}
**Author**: ${author}
**Ups**: ${ups}

[View Meme Here](${postLink})
`;

      await message.channel.send(memeMessage);
      await message.channel.send({ content: url });  
    } catch (err) {
      console.error('Error fetching meme:', err);
      await message.channel.send('Sorry, I couldn\'t fetch a meme right now.');
    }
  },
};