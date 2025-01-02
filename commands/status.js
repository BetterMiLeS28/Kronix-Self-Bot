module.exports = {
    name: 'status',
    async execute(message, args) {
      if (!args[0]) {
        return message.channel.send('```Please specify a status: dnd, idle, on, off, afk, online, offline, donotdisturb.```');
      }
  
      const statusMap = {
        dnd: 'dnd',             // Do Not Disturb
        donotdisturb: 'dnd',    // Alias for Do Not Disturb
        on: 'online',           // Online
        online: 'online',       // Alias for Online
        off: 'invisible',       // Offline is equivalent to invisible in Discord
        offline: 'invisible',   // Alias for Offline
        afk: 'idle',            // AFK (Away From Keyboard)
        idle: 'idle'            // Alias for Idle
      };
  
      const status = args[0].toLowerCase();
  
      // Check if the provided status is valid
      if (!statusMap[status]) {
        return message.channel.send('```Invalid status! Please use one of the following: dnd, idle, on, off, afk, online, offline, donotdisturb.```');
      }
  
      try {
        // Set the user's status
        await message.client.user.setPresence({
          status: statusMap[status],
        });
        return message.channel.send(`\`\`\`Your status has been updated to ${statusMap[status]}. \`\`\``);
      } catch (error) {
        console.error('Error setting status:', error);
        return message.channel.send('```An error occurred while setting your status.```');
      }
    }
};
