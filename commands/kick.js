const { Permissions } = require("discord.js");

module.exports = {
  name: "kick",
  description: "Kick a user from the server.",
  async execute(message, client, args) {

    const user = message.mentions.users.first() || client.users.cache.get(args[0]);

    if (!user) {
      return message.channel.send("Please mention a user to kick.");
    }

    const member = message.guild.members.cache.get(user.id);

    if (!member) {
      return message.channel.send("This user is not in the server.");
    }

    try {
      
      await member.kick();
      message.channel.send(`${user.tag} has been kicked.`);
    } catch (error) {
      console.error(error);
      message.channel.send("An error occurred while kicking the user.");
    }
  },
};
