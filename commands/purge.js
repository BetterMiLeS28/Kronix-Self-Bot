module.exports = {
    name: 'purge',
    async execute(message, args, config) {
      try {
  
        if (!args[0] || isNaN(args[0])) {
          return message.channel.send('```Please specify the number of messages to delete.```');
        }
  
        const deleteCount = parseInt(args[0], 10);
  
        if (deleteCount < 1 || deleteCount > 100) {
          return message.channel.send('```You can only delete between 1 and 100 messages at a time.```');
        }
  
        try {
          // Fetch messages
          const fetchedMessages = await message.channel.messages.fetch({ limit: 100 });
  
          // Filter messages to include only those sent by the bot
          const botMessages = fetchedMessages.filter(msg => msg.author.id === message.client.user.id).first(deleteCount);
  
          if (botMessages.length === 0) {
            return message.channel.send('```No bot messages found to delete.```')
              .then(msg => setTimeout(() => msg.delete(), 5000))
              .catch(err => console.error('Error deleting confirmation message:', err));
          }
  
          let deletedCount = 0;
  
          for (const botMessage of botMessages) {
            try {
              await botMessage.delete();
              deletedCount++;
            } catch (err) {
              if (err.code === 10008) {
                console.warn(`Message ID ${botMessage.id} not found (likely already deleted).`);
              } else {
                console.error(`Failed to delete message ID ${botMessage.id}:`, err);
              }
            }
          }
  
          return message.channel.send(`\`\`\`Successfully deleted ${deletedCount} bot messages.\`\`\``)
            .then(msg => setTimeout(() => msg.delete(), 5000)) // Auto-delete confirmation
            .catch(err => console.error('Error deleting confirmation message:', err));
        } catch (err) {
          console.error('Error during purge operation:', err);
          return message.channel.send('```An error occurred while trying to purge messages.```');
        }
      } catch (err) {
        if (err.code === 10008) {
          console.log("This is not an error just a minor issue—message already deleted.");
        } else {
          console.error(err);
        }
      }
    },
  };
  