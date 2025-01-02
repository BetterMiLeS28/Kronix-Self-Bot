const math = require('mathjs');

module.exports = {
  name: 'math',
  async execute(message, args) {
    if (!args.length) {
      return message.channel.send('```Please provide an equation to solve.```');
    }

    let equation = args.join(' ');


    try {
      // Evaluate the equation
      const result = math.evaluate(equation);
      return message.channel.send(`\`\`\`Solution to ${equation}: ${result}\`\`\``);
    } catch (err) {
      console.error('Math error:', err);
      return message.channel.send('```Invalid math expression or equation.```');
    }
  }
};
