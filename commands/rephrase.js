const axios = require('axios');
const config = require('../config.json');
module.exports = {
    name: 'rephrase',
    async execute(message, args) {
        if (args.length < 1) {
            return message.channel.send('Please provide a text to rephrase.');
        }

        const textToRephrase = args.join(' '); // Join arguments into a single string
        console.log('Text to rephrase:', textToRephrase);

        try {
            // Send the request to the Gemini API for rephrasing
            const response = await axios.post(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${config.gemini_api_key}`,
                {
                    contents: [
                        {
                            parts: [
                                { text: `Rephrase this text: "${textToRephrase}"` }
                            ]
                        }
                    ]
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );



            const mgm = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
   
            

            if (mgm) {
                // Send the original and rephrased text to the channel
                await message.channel.send(`Original: \`\`\`${textToRephrase}\`\`\`\n\nRephrased: \`\`\`${mgm}\`\`\``);
            } else {
                await message.channel.send('Could not retrieve rephrased text.');
            }
        } catch (error) {
            console.error('Error rephrasing text:', error);
            await message.channel.send('There was an error rephrasing the text.');
        }
    },
};
