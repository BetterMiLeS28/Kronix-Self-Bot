module.exports = {
    name: 'avatar',
    async execute(message, args) {
        if (!args[0]) {
            return message.channel.send('```Please provide an image URL for the new avatar.```');
        }

        const imageUrl = args[0];

        try {
            // Change the bot's avatar
            await message.client.user.setAvatar(imageUrl);

            return message.channel.send(`\`\`\`Bot avatar has been updated.\`\`\``);
        } catch (error) {
            console.error('Error updating avatar:', error);
            return message.channel.send('```An error occurred while changing the bot avatar. Please ensure the URL is valid.```');
        }
    }
};
