const { log, error } = require('../utils/logger');
const ytdl = require("node-yt-dl");

module.exports = {
    name: 'ytsearch',
    async execute(message, args) {
        if (args.length === 0) {
            return message.channel.send('Please provide a search query!');
        }

        const query = args.join(' ');

        try {
            const searchResult = await ytdl.search(query);

            if (searchResult.data.length === 0) {
                return message.channel.send('No results found!');
            }

            for (let i = 0; i < 5; i++) {
                const video = searchResult.data[i];
                const videoUrl = video.url;
                const videoTitle = video.title || 'No title available';
                const videoImg = video.img || 'No image available';
                const authorName = video.author?.name || 'Unknown author';
                const authorUrl = video.author?.url || '#';

                let messageContent = `# **Result ${i + 1}:**\n## **Title**: ${videoTitle}\n## **URL**: ${videoUrl}\n## **Author**: [${authorName}](${authorUrl})\n## **Thumbnail**: ${videoImg}`;

                await message.channel.send(messageContent);
            }
        } catch (err) {
            error('Error during search or sending result:', err);
            await message.channel.send('There was an error fetching the search results.');
        }
    },
};
