const axios = require('axios');
module.exports = {
  name: 'i2c',
  async execute(message, args) {
    if (!args.length) {
      return message.reply('❕ Please provide an amount in INR.');
    }

    try {
      const amount = parseFloat(args[0].replace('₹', ''));
      if (isNaN(amount)) {
        return message.reply('❌ Invalid amount. Please enter a valid number.');
      }

      const response = await axios.get('https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/inr.json');
      const rates = response.data.inr;

      if (!rates || !rates.usd || !rates.ltc) {
        return message.reply('❌ Unable to fetch the conversion rates. Try again later.');
      }

      const usdRate = rates.usd;
      const ltcRate = rates.ltc;
      const usdAmount = amount * usdRate;
      const ltcAmount = amount * ltcRate;

      const formattedLtc = ltcAmount < 0.01 && ltcAmount > 0 
        ? ltcAmount.toExponential(2) 
        : ltcAmount.toFixed(8).replace(/\.?0+$/, '');

      await message.reply(`\`-\` **AMOUNT IS**: \`${usdAmount.toFixed(2)}$\ and ${formattedLtc} LTC\``);

      console.log(`[+] I2C DONE ✅ Amount: ${amount} INR -> ${usdAmount.toFixed(2)} USD, ${formattedLtc} LTC`);
    } catch (error) {
      console.error('Error in I2C command:', error);
      await message.reply('❌ An error occurred while processing your request. Please try again later.');
    }
  },
};
