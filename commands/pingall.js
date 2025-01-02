module.exports = {
  name: 'pingall',
 attack: true,
  async execute(message, args, config) {
    try {
      await message.delete();

      const channels = message.guild.channels.cache.filter(c => c.type === 'GUILD_TEXT');
      const members = message.guild.members.cache.filter(member => !member.user.bot);

      let pings = [];
      let totalPings = 0;

      for (const [memberId, member] of members) {
        pings.push(`<@${memberId}>`);
        totalPings++;

        if (pings.length === 5) {
          for (const [channelId, channel] of channels) {
            await channel.send(pings.join(' '));
          }
          pings = [];
        }
      }

      if (pings.length > 0) {
        for (const [channelId, channel] of channels) {
          await channel.send(pings.join(' '));
        }
      }

      message.channel.send(`\`\`\`? Successfully pinged ${totalPings} members across all channels.\`\`\``);
    } catch (error) {
      console.error('Error pinging users:', error);
      message.channel.send(`\`\`\`? An error occurred while trying to ping users.\`\`\``);
    }
  }
};
