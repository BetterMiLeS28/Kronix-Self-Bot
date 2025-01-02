const axios = require("axios");

module.exports = {
  name: "kiss",
  description: "kiss someone.",
  aliases: ["kiss"],
  async execute(message, client, args) {
    const user = message.mentions.users.first() || client.users.cache.get(args[0]);
    const me = message.author;

    if (!user) {
      return message.channel.send("Please mention a user to kiss.");
    }

    try {
      const result = await axios.get("https://api.otakugifs.xyz/gif?reaction=kiss&format=gif");

      const messageContent = `${me} kissed ${user}\n${result.data.url}`;

      message.channel.send(messageContent);
    } catch (error) {
      console.error(error);
      message.channel.send("An error occurred while retrieving the image.");
    }
  },
};
