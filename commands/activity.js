module.exports = {
    name: 'activity',
    async execute(message, args) {
        if (!args[0]) {
            return message.channel.send('```Please specify a game to play.```');
        }

        const game = args.join(' '); // Join all arguments as a single game name

        try {
            // Set the bot's "Now Playing" status with the custom game
            await message.client.user.setPresence({
                activities: [{
                    name: game,    // Custom game name
                    type: 'PLAYING' // Can be 'PLAYING', 'STREAMING', 'LISTENING', 'WATCHING'
                }],
                status: 'online'  // Set the bot's status to online
            });

            return message.channel.send(`\`\`\`Your activity has been set to: Playing ${game}\`\`\``);
        } catch (error) {
            console.error('Error setting activity:', error);
            return message.channel.send('```An error occurred while setting your activity.```');
        }
    }
};
