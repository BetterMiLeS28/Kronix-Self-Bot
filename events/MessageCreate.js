const { log, error } = require('../utils/logger');
const fs = require('fs');
const path = require('path');

const RESPONDER_FILE_PATH = path.join(__dirname, '../responder.json');

// Function to load responder data from the file
function loadResponderData() {
    try {
        return JSON.parse(fs.readFileSync(RESPONDER_FILE_PATH, 'utf-8'));
    } catch (err) {
        console.error('Error loading responder data:', err);
        return {};
    }
}

let lastAfkReply = 0;

module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        if (message.author.bot) return;

        const { config } = client;
        const isGuildChannel = !!message.guild;
        const trigger = message.content.toLowerCase();

        // Reload responder data dynamically
        const responderData = loadResponderData();

        // Handle AFK responses
        if (config.afkMode && message.mentions.has(client.user)) {
            const now = Date.now();
            if (now - lastAfkReply > 10000) {
                lastAfkReply = now;
                const reason = config.afkReason || 'No reason provided';
                const elapsed = config.afkStartTime ? Math.floor((now - config.afkStartTime) / 1000) : 0;

                try {
                    await message.reply(`Huihui I am currently AFK.\nReason: ${reason}. Time: ${elapsed}s ago.`);
                } catch (err) {
                    error('Error sending AFK reply:', err);
                }
            }
            return;
        }

        // Handle math expressions
        const mathExpression = trigger.match(/^([-+]?[0-9]*\.?[0-9]+[\+\-\*\/])+(-?[0-9]*\.?[0-9]+)$/);
        if (mathExpression && config.allowedIds.includes(message.author.id)) {
            try {
                const result = Function('"use strict"; return (' + mathExpression[0] + ')')();
                await message.channel.send(`${result}`);
                if (isGuildChannel) await message.delete();
            } catch (err) {
                error('Calculator error:', err);
                await message.channel.send('Invalid expression.');
            }
            return;
        }

        // Handle responders
        if (responderData[trigger]) {
            await message.channel.send(responderData[trigger]);
            return;
        }

        // Handle commands
        if (trigger.startsWith(config.prefix)) {
            const args = trigger.slice(config.prefix.length).trim().split(/ +/);
            const commandName = args.shift().toLowerCase();
            const command = client.commands.get(commandName);

            if (command && config.allowedIds.includes(message.author.id)) {
                try {
                    await command.execute(message, args, config, client);
                } catch (err) {
                    error(`Error executing ${commandName}:`, err);
                    await message.channel.send('Error executing the command.');
                }
            }
        }
    },
};
