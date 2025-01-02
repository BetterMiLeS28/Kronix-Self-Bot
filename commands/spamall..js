module.exports = {
  name: 'spamall',
 attack:true,
  async execute(message, args, config) {
    if (args.length < 2) {
      return message.channel.send(`\`\`\`Usage: ${config.prefix}spamAll "amount" "message"\`\`\``);
    }
    const amount = parseInt(args[0], 10);
    const messageContent = args.slice(1).join(' ');

    if (isNaN(amount) || amount <= 0 || amount > 100) {
      return message.channel.send(`\`\`\`❕ Please provide a valid number between 1 and 100 for the amount.\`\`\``);
    }

    if (!messageContent) {
      return message.channel.send(`\`\`\`❗ Please provide a message to spam.\`\`\``);
    }

    try {
await message.delete();

      const channels = message.guild.channels.cache.filter(c => c.type === 'GUILD_TEXT');

      let totalMessagesSent = 0;

      for (const [channelId, channel] of channels) {
        for (let i = 0; i < amount; i++) {
          await channel.send(messageContent);
          totalMessagesSent++;
        }
      }

      message.channel.send(`\`\`\`✅ Successfully sent ${totalMessagesSent} messages across all channels.\`\`\``);
    } catch (error) {
      console.error('Error spamming messages across channels:', error);
      message.channel.send(`\`\`\`❌ An error occurred while trying to spam messages across channels.\`\`\``);
    }
  }
};
