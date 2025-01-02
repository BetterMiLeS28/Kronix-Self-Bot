const { log, error } = require('../utils/logger');
const axios = require('axios');

module.exports = {
    name: 'serverinfo',
    async execute(message, args, config, client) {
        try {
            const { guild } = message;

            if (!guild) {
                return message.channel.send('This command must be used in a server.');
            }

            // Fetch the owner info using the API
            let ownerName = 'Unknown';
            try {
                const response = await axios.get(`https://discordlookup.mesalytic.moe/v1/user/${guild.ownerId}`);
                ownerName = response.data.username || 'Unknown';
            } catch (err) {
                console.error('Error fetching owner name:', err);
            }

            const serverInfo = `
\`\`\`diff
+ Server Name: ${guild.name}
+ Server ID: ${guild.id}
+ Description: ${guild.description || 'No description'}
+ Region/Locale: ${guild.preferredLocale}
+ Created On: ${guild.createdAt.toDateString()}
+ Member Count: ${guild.memberCount}
+ Owner: ${ownerName}
+ Verification Level: ${guild.verificationLevel}
+ NSFW Level: ${guild.nsfwLevel}
+ Premium Tier: ${guild.premiumTier}
+ Premium Subscription Count: ${guild.premiumSubscriptionCount}
+ Maximum Members: ${guild.maximumMembers}
+ Maximum Presences: ${guild.maximumPresences || 'N/A'}
+ Max Video Channel Users: ${guild.maxVideoChannelUsers}
+ Max Stage Video Channel Users: ${guild.maxStageVideoChannelUsers}
+ System Channel ID: ${guild.systemChannelId}
+ System Channel Flags: ${guild.systemChannelFlags.bitfield}
+ AFK Timeout: ${guild.afkTimeout / 60} minutes
+ AFK Channel ID: ${guild.afkChannelId || 'None'}
+ Explicit Content Filter: ${guild.explicitContentFilter}
+ MFA Level: ${guild.mfaLevel}
+ Rules Channel ID: ${guild.rulesChannelId || 'None'}
+ Public Updates Channel ID: ${guild.publicUpdatesChannelId || 'None'}
+ Safety Alerts Channel ID: ${guild.safetyAlertsChannelId || 'None'}
+ Vanity URL Code: ${guild.vanityURLCode || 'None'}
+ Vanity URL Uses: ${guild.vanityURLUses || 'N/A'}
+ Discovery Splash: ${guild.discoverySplash || 'None'}
+ Splash Image: ${guild.splash || 'None'}
+ Banner Image: ${guild.banner || 'None'}
+ Icon: ${guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png` : 'None'}
+ Joined On: ${new Date(guild.joinedTimestamp).toDateString()}
+ Application ID: ${guild.applicationId || 'None'}
+ Available: ${guild.available ? 'Yes' : 'No'}
+ Large Server: ${guild.large ? 'Yes' : 'No'}
+ Shard ID: ${guild.shardId}
+ Member Verification Gate: ${guild.features.includes('MEMBER_VERIFICATION_GATE_ENABLED') ? 'Enabled' : 'Disabled'}
+ Channels Count: ${guild.channels.cache.size}
+ Roles Count: ${guild.roles.cache.size}
+ Emojis Count: ${guild.emojis.cache.size}
+ Stickers Count: ${guild.stickers.cache.size}
+ Public Updates Channel: ${guild.publicUpdatesChannelId ? 'Available' : 'None'}
\`\`\`
            `;

            await message.channel.send(serverInfo);
            log('command', `Executed serverinfo command for ${message.author.tag}`);

        } catch (err) {
            error('Error executing serverinfo command:', err);
            await message.channel.send('There was an error fetching the server info.');
        }
    },
};
