const SpotifyWebApi = require('spotify-web-api-node');
const fs = require('fs');
const config = require('./config.json');

const spotifyApi = new SpotifyWebApi({
    clientId: config.spotify.client_id,
    clientSecret: config.spotify.client_secret
});

async function authenticate() {
    const data = await spotifyApi.clientCredentialsGrant();
    spotifyApi.setAccessToken(data.body['access_token']);
}

function extractSongId(url) {
    const match = url.match(/track\/([a-zA-Z0-9]+)/);
    return match ? match[1] : null;
}

async function getSongInfo(songId) {
    try {
        const trackData = await spotifyApi.getTrack(songId);
        const track = trackData.body;

        const album = track.album;
        const artists = track.artists.map(artist => artist.name);
        const songName = track.name;
        const durationMs = track.duration_ms;
        const albumId = album.id;
        const albumName = album.name;
        const artistIds = track.artists.map(artist => artist.id);
        const largeImage = album.images[0]?.url;
        const smallImage = album.images[album.images.length - 1]?.url;

        return {
            largeImageId: largeImage,
            smallImageId: smallImage,
            albumName: albumName,
            artists: artists,
            name: songName,
            duration: durationMs,
            songId: songId,
            albumId: albumId,
            artistIds: artistIds
        };

    } catch (error) {
        console.error('Error fetching song info:', error);
        return null;
    }
}

function saveSongsData(songs) {
    const filePath = './songs.js';
    let existingData = { songs: [] };

    if (fs.existsSync(filePath)) {
        existingData = require(filePath);
    }

    existingData.songs.push(...songs);

    const jsData = `module.exports = ${JSON.stringify(existingData, null, 2)};`;

    fs.writeFileSync(filePath, jsData);

    console.log('Song information saved to songs.js');
}

async function processSongs(urls) {
    await authenticate();
    const songs = new Set();

    for (const url of urls) {
        const songId = extractSongId(url);
        if (songId && !songs.has(songId)) {
            const songInfo = await getSongInfo(songId);
            if (songInfo) {
                songs.add(songInfo);
            }
        } else {
            console.error(`Invalid or duplicate Spotify URL: ${url}`);
        }
    }

    if (songs.size > 0) {
        saveSongsData([...songs]);
    }
}

const spotifyUrls = [
    'https://open.spotify.com/track/01kTHp76rGti2G92XpAYjS',
    'https://open.spotify.com/track/6hRwCKxlOZNKQeeLvDBpQE',
    'https://open.spotify.com/track/6vGSk56yRVY1q5bgGbMcDd',
    'https://open.spotify.com/track/21rHIkV5NvM5dKOdhLTTx9',
    'https://open.spotify.com/track/6sAiL6OJWlehiYXwLjVN2R',
    'https://open.spotify.com/track/1NP6kr9OodW9t4M8oHpILz',
    'https://open.spotify.com/track/2q233effzNM0ngiLIS6ECC',
    'https://open.spotify.com/track/3ApaTZGp5hMhPzwgBflqQR',
    'https://open.spotify.com/track/06MOEqkmfBdDbSbceirD66',
    'https://open.spotify.com/track/2283zZ5rVUr1G08tTlkKc1',
    'https://open.spotify.com/track/21rHIkV5NvM5dKOdhLTTx9',
    'https://open.spotify.com/track/6gClLxbq32u8bhukZ6hBaG',
    'https://open.spotify.com/track/7D7e6hm2LiNd6nLuJF6K9Q',
    'https://open.spotify.com/track/23nZgRaT3VS56RltsU0DpU?si=zZ5EL2Y5SWiqtl4qEsAcig',
    'https://open.spotify.com/track/23nZgRaT3VS56RltsU0DpU?si=zZ5EL2Y5SWiqtl4qEsAcig',
    'https://open.spotify.com/track/36eBnIKDJpliBPsKDk7THr?si=Ivm3oRFvShOIRiML7BiWPw',
    'https://open.spotify.com/track/05vvATezyaroYDZLqkdAZN?si=snEvRAGhQMumngqjUok8UA',
    'https://open.spotify.com/track/23nZgRaT3VS56RltsU0DpU?si=zZ5EL2Y5SWiqtl4qEsAcig'
];

processSongs(spotifyUrls);
