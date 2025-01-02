const axios = require('axios');
const { config } = require('../config.json');

module.exports = {
    name: 'weather',
    description: 'Get the current weather for a specified city.',
    async execute(message, args) {
        if (args.length === 0) {
            return message.channel.send('Please provide a city name. Usage: `!weather <city>`');
        }

        const cityName = args.join(' ');
        const geoApiUrl = `https://api.api-ninjas.com/v1/geocoding?city=${encodeURIComponent(cityName)}`;
        const weatherApiUrl = `https://api.api-ninjas.com/v1/weather`;
       const apiKey = `${config.api_ninjas_key}`


        try {
            const geoResponse = await axios.get(geoApiUrl, {
                headers: { 'X-Api-Key': apiKey },
            });

            if (geoResponse.data.length === 0) {
                return message.channel.send(`Could not find coordinates for "${cityName}".`);
            }

            const { latitude, longitude } = geoResponse.data[0];

            const weatherResponse = await axios.get(`${weatherApiUrl}?lat=${latitude}&lon=${longitude}`, {
                headers: { 'X-Api-Key': apiKey },
            });

            const weather = weatherResponse.data;

            const weatherMessage = `
\`\`\`
Weather in ${cityName}:
Temperature  : ${weather.temp}°C
Feels Like   : ${weather.feels_like}°C
Min Temp     : ${weather.min_temp}°C
Max Temp     : ${weather.max_temp}°C
Humidity     : ${weather.humidity}%
Wind Speed   : ${weather.wind_speed} m/s
Wind Degrees : ${weather.wind_degrees}°
Clouds       : ${weather.cloud_pct}%
\`\`\`
`;

            await message.channel.send(weatherMessage);
        } catch (error) {
            console.error('Error fetching weather data:', error);
            return message.channel.send('An error occurred while fetching weather data. Please try again later.');
        }
    },
};
