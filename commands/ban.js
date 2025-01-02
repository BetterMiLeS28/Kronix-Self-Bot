const { Permissions } = require("discord.js");

module.exports = {
  name: "ban",
  description: "Ban a user from the server.",
  async execute(message, client, args) {

    const user = message.mentions.users.first() || client.users.cache.get(args[0]);

    if (!user) {
      return message.channel.send("Please mention a user to ban.");
    }

    const member = message.guild.members.cache.get(user.id);

    if (!member) {
      return message.channel.send("This user is not in the server.");
    }


    try {
        
        await member.ban();
        message.channel.send(`${user.tag} has been banned.`);
      } catch (error) {
        console.error(error);
        message.channel.send("An error occurred while banning the user.");
      }
  },
};
