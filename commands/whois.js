module.exports = {
    name: 'whois',
    async execute(message, args) {

        const user = message.mentions.users.first() || message.guild.members.cache.get(args[0]) || message.author;

        let userInfo = {
            username: user.username,
            discriminator: user.discriminator,
            id: user.id,
            status: user.presence ? user.presence.status : 'offline',
            joinedAt: user.joinedAt ? user.joinedAt.toDateString() : 'N/A',
            roles: 'No roles (DM)', 
            flags: user.flags ? user.flags.toArray().join(', ') : 'None',
            globalName: user.globalName || 'N/A',
        };

        if (message.guild) {
            const member = message.guild.members.cache.get(user.id);
            if (member) {
                userInfo.roles = member.roles.cache.map(role => role.name).join(', ') || 'No roles';
                userInfo.joinedAt = member.joinedAt ? member.joinedAt.toDateString() : 'N/A';
            }
        }

        const userInfoText = `
\`\`\`yaml
Username: ${userInfo.username}#${userInfo.discriminator}
ID: ${userInfo.id}
Global Name: ${userInfo.globalName}
Status: ${userInfo.status}
Joined Server: ${userInfo.joinedAt}
Roles: ${userInfo.roles}
Flags: ${userInfo.flags}
\`\`\`
        `;

        await message.channel.send(userInfoText);
    },
};