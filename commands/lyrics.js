const axios = require('axios');
const config = require('../config.json');
module.exports = {
    name: 'lyrics',
    async execute(message, args) {
        if (args.length < 1) {
            return message.channel.send('Please provide a song name (and optionally an artist).');
        }

        const term = args.join(' ');  
        const uid = config.stand4.uid;  
        const tokenid = config.stand4.token;  
        const format = 'json';  

        try {

            const response = await axios({
                method: 'get',
                url: 'https://www.stands4.com/services/v2/lyrics.php',
                params: {
                    uid: uid,
                    tokenid: tokenid,
                    term: term,
                    format: format,
                },
                data: undefined,
            });

                const result = response.data.result[0];  
                console.log(result)
                const song = result.song;
                const artist = result.artist;
                const songLink = result['song-link'];
                const artistLink = result['artist-link'];
                const album = result.album;
                const albumLink = result['album-link'];

                message.channel.send(`Lyrics for ${song} by ${artist}:\n\`\`\`\nSong: ${song}\nArtist: ${artist}\nAlbum: ${album}\nLink to Song Lyrics: ${songLink}\nLink to Artist: ${artistLink}\nLink to Album: ${albumLink}\n\`\`\` link for Lyrics: ${songLink}`);
            
        } catch (error) {
            console.error('Error fetching lyrics:', error);
            message.channel.send('There was an error fetching the lyrics. Please try again later.');
        }
    },
};