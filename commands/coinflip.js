module.exports = {
    name: 'coinflip',
    description: 'Flip a coin!',
    execute(message, args) {
        const choices = ['heads', 'tails'];
        const botChoice = choices[Math.floor(Math.random() * choices.length)];

        message.reply(`\`\`\`The coin landed on **${botChoice}**!\`\`\``);
    },
};
