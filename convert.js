const fs = require('fs');

const songsPath = 'songs.js';
const jsonPath = 'songs.json';

const songsData = require(`./${songsPath}`);

const replaceImageUrl = (url) => url.replace('https://i.scdn.co/image/', 'spotify:');

songsData.songs.forEach(song => {
  song.largeImageId = replaceImageUrl(song.largeImageId);
  song.smallImageId = replaceImageUrl(song.smallImageId);
});

fs.writeFile(jsonPath, JSON.stringify(songsData, null, 2), 'utf8', (err) => {
  if (err) {
    console.error('Error writing file:', err);
  } else {
    console.log('File successfully converted to JSON and saved as songs.json');
  }
});