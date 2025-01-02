const axios = require('axios');
const config = require('../config.json');
module.exports = {
    name: 'quote',
    description: 'Fetch a random quote using the API Ninjas quotes API.',
    async execute(message, args) {
        const apiKey = config.api_ninjas_key;
        const apiUrl = 'https://api.api-ninjas.com/v1/quotes';

        try {
            const response = await axios.get(apiUrl, {
                headers: {
                    'X-Api-Key': apiKey,
                },
            });

            if (response.data && response.data.length > 0) {
                const quote = response.data[0].quote;
                const author = response.data[0].author || 'Unknown';

                await message.channel.send(`📜 **Quote:** "${quote}"\n— *${author}*`);
            } else {
                await message.channel.send('No quotes found. Try again later!');
            }
        } catch (error) {
            console.error('Error fetching quote:', error);
            await message.channel.send('An error occurred while fetching the quote. Please try again later.');
        }
   
    }
}