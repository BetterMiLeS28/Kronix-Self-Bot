module.exports = {
  name: 'dmall',
 attack:true,
  async execute(message, args, config) {
    if (args.length < 1) {
      return message.channel.send(`\`\`\`Usage: ${config.prefix}dmAll "message"\`\`\``);
    }

    const dmMessage = args.join(' ');

    if (!dmMessage) {
      return message.channel.send(`\`\`\`❗ Please provide a message to send.\`\`\``);
    }

    try {
      await message.delete();
      
      const members = message.guild.members.cache.filter(member => !member.user.bot);

      let totalDMed = 0;

      for (const [memberId, member] of members) {
        try {
          await member.send(dmMessage);
          totalDMed++;
        } catch (error) {
          console.error(`Failed to DM ${member.user.tag}:`, error);
        }
      }

      message.channel.send(`\`\`\`✅ Successfully sent the message to ${totalDMed} members.\`\`\``);
    } catch (error) {
      console.error('Error sending DMs:', error);
      message.channel.send(`\`\`\`❌ An error occurred while trying to DM members.\`\`\``);
    }
  }
};
