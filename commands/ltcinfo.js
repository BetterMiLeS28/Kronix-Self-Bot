const axios = require('axios');

module.exports = {
  name: 'ltcinfo',
  async execute(message) {
    try {
      const inrResponse = await axios.get('https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/ltc.json');

      const ltcRates = inrResponse.data.ltc;

      if (!ltcRates) {
        return message.reply('❌ Unable to fetch LTC prices. Try again later.');
      }

      const ltcInInr = ltcRates.inr;
      const ltcInUsd = ltcRates.usd;

      await message.reply(
        `📊 **Litecoin (LTC) Prices:**\n` +
        `💸 **INR**: \`₹${ltcInInr.toFixed(2)}\`\n` +
        `💵 **USD**: \`$${ltcInUsd.toFixed(2)}\``
      );

      console.log(`[+] LTCINFO DONE ✅ LTC Price: ₹${ltcInInr.toFixed(2)} (INR), $${ltcInUsd.toFixed(2)} (USD)`);
    } catch (error) {
      console.error('Error in LTCINFO command:', error);
      await message.reply('❌ An error occurred while fetching LTC prices. Please try again later.');
    }
  },
};
