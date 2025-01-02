const axios = require('axios');
const config = require('../config.json');
module.exports = {
  name: 'githubinfo',
  async execute(message, args) {
    if (args.length < 1) {
      return message.channel.send('Please provide a GitHub username.');
    }

    const username = args[0];
    const token =  config.github_token; // Your GitHub Token

    try {
      const response = await axios.get(`https://api.github.com/users/${username}`, {
        headers: {
          Authorization: `token ${token}`,
          'X-GitHub-Api-Version': '2022-11-28',
        },
      });

      const user = response.data;

      // Format the output
      const info = `
\`\`\`yaml
GitHub Username: ${user.login}
Name: ${user.name}
Bio: ${user.bio}
Company: ${user.company}
Location: ${user.location}
Blog: ${user.blog}
Twitter: @${user.twitter_username}
Public Repos: ${user.public_repos}
Followers: ${user.followers}
Following: ${user.following}
Created At: ${new Date(user.created_at).toLocaleDateString()}
Profile: ${user.html_url}
\`\`\`
      `;

      message.channel.send(info);
    } catch (error) {
      console.error('Error fetching GitHub user data:', error);
      message.channel.send('There was an error fetching the GitHub user information.');
    }
  },
};
