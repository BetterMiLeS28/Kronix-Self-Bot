const axios = require('axios');

module.exports = {
  name: 'l2c',
  async execute(message, args) {
    if (!args.length) {
      return message.reply('❕ Please provide an amount in LTC.');
    }

    try {
      const amount = parseFloat(args[0].replace('LTC', '').trim());
      if (isNaN(amount)) {
        return message.reply('❌ Invalid amount. Please enter a valid number.');
      }

      const response = await axios.get('https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/ltc.json');
      const rates = response.data.ltc;

      if (!rates || !rates.inr) {
        return message.reply('❌ Unable to fetch INR conversion rate. Try again later.');
      }
      if (!rates || !rates.usd) {
        return message.reply('❌ Unable to fetch USD conversion rate. Try again later.');
      }

      const inrRate = rates.inr;
      const usdRate = rates.usd;
      const inrAmount = amount * inrRate;
      const usdAmount = amount * usdRate;

      await message.reply(`\`-\` **AMOUNT IS**: \`${inrAmount.toFixed(2)}₹\ and ${usdAmount.toFixed(2)}$\``);

      console.log(`[+] LTC2INR DONE ✅ Amount: ${amount} LTC -> ${inrAmount.toFixed(2)} INR, ${usdAmount.toFixed(2)} USD`);
    } catch (error) {
      console.error('Error in LTC2INR command:', error);
      await message.reply('❌ An error occurred while processing your request. Please try again later.');
    }
  },
};
