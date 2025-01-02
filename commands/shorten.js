const axios = require('axios');  
const { error } = require('../utils/logger');  
const config = require('../config.json');
module.exports = {
    name: 'shorten',
    async execute(message, args) {
        if (args.length !== 1) {
            return message.channel.send('Please provide a URL to shorten.');
        }

        const url = args[0];

        const regex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
        if (!regex.test(url)) {
            return message.channel.send('Invalid URL provided.');
        }

        const apiUrl = 'https://api.t.ly/api/v1/link/shorten';
        const apiToken = config.tly_api_token;  

        const headers = {
            'Authorization': `Bearer ${apiToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        };

        const body = {
            long_url: url,
            domain: 'https://t.ly/',  
            expire_at_datetime: '2035-01-17 15:00:00',  
            description: 'Social Media Link',  
            public_stats: true,  
            meta: {
                smart_urls: [
                    { type: 'US', url: 'usa.com' },
                    { type: 'iPhone', url: 'apple.com' }
                ]
            }
        };

        try {
            const response = await axios.post(apiUrl, body, { headers });

            if (response.data && response.data.short_url) {
                const shortenedUrl = response.data.short_url;

                message.channel.send(`Shortened URL: \`\`${shortenedUrl}\`\``);
            } else {
                message.channel.send('Failed to shorten the URL. Please try again later.');
            }
        } catch (err) {
            error('Error shortening URL:', err);
            message.channel.send('An error occurred while shortening the URL. Please try again later.');
        }
    },
};