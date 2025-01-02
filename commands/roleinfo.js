const { log, error } = require('../utils/logger');

module.exports = {
    name: 'roleinfo',
    async execute(message, args) {
        if (args.length < 1) {
            return message.channel.send('Please provide a role name, mention, or ID.');
        }

        let role = message.mentions.roles.first();
        if (!role) {
            role = message.guild.roles.cache.get(args[0]) || 
                   message.guild.roles.cache.find(r => r.name.toLowerCase() === args.join(' ').toLowerCase());
        }

        if (!role) {
            return message.channel.send('Role not found.');
        }

        const roleInfo = `
\`\`\`diff
+ Role Name: ${role.name}
+ Role ID: ${role.id}
+ Color: ${role.hexColor}
+ Position: ${role.position}
+ Mentionable: ${role.mentionable ? 'Yes' : 'No'}
+ Hoisted: ${role.hoist ? 'Yes' : 'No'}
+ Permissions: ${role.permissions.bitfield}
+ Created At: ${role.createdAt.toDateString()}
\`\`\`
        `;

        try {
            await message.channel.send(roleInfo);
        } catch (err) {
            error('Error sending roleinfo:', err);
            await message.channel.send('An error occurred while retrieving role info.');
        }
    },
};
