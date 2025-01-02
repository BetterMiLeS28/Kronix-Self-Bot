const puppeteer = require('puppeteer');

module.exports = {
  name: 'ltc',
  async execute(message, args) {
    if (!args.length) {
      return message.channel.send('```Please provide a Litecoin address.```');
    }

    const address = args[0];
    const url = `https://chainz.cryptoid.info/ltc/address.dws?${address}.htm`;

    try {
      const browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();

      await page.setRequestInterception(true);
      page.on('request', (request) => {
        if (request.resourceType() === 'image' || request.resourceType() === 'stylesheet') {
          request.abort();
        } else {
          request.continue();
        }
      });

      page.on('response', async (response) => {
        const requestUrl = response.url();

        if (requestUrl.startsWith('https://chainz.cryptoid.info/explorer/address.summary2.dws?coin=ltc&id=') &&
            requestUrl.endsWith('fmt.js')) {
          try {
            const responseBody = await response.json();

            if (!responseBody) {
              console.error('No response body found');
              return message.channel.send('```Failed to retrieve Litecoin address data.```');
            }

            const { block, firstblock, firstdate, lastblock, lastdate, balance, received, sent, rank, tx } = responseBody;

            const firstSeenDate = firstdate ? new Date(firstdate * 1000).toLocaleString() : 'Unknown';
            const lastSeenDate = lastdate ? new Date(lastdate * 1000).toLocaleString() : 'Unknown';
            const rankStatus = rank !== 'unranked' ? rank : 'No rank';

            const totalTransactions = tx.length;

            let highestTx = null;
            let lowestTx = null;

            if (totalTransactions > 0) {
              tx.forEach((transaction) => {
                const [txid, address, block, timestamp, amount] = transaction;
                const transactionAmount = amount;

                if (!highestTx || transactionAmount > highestTx.amount) {
                  highestTx = { txid, address, block, timestamp, amount: transactionAmount };
                }

                if (!lowestTx || transactionAmount < lowestTx.amount) {
                  lowestTx = { txid, address, block, timestamp, amount: transactionAmount };
                }
              });
            }

            const highestTransaction = highestTx 
              ? `Highest Tx: TxID: ${highestTx.txid} | Address: ${highestTx.address} | Block: ${highestTx.block} | Date: ${new Date(highestTx.timestamp * 1000).toLocaleString()} | Amount: ${highestTx.amount}`
              : 'No transactions found';

            const lowestTransaction = lowestTx 
              ? `Lowest Tx: TxID: ${lowestTx.txid} | Address: ${lowestTx.address} | Block: ${lowestTx.block} | Date: ${new Date(lowestTx.timestamp * 1000).toLocaleString()} | Amount: ${lowestTx.amount}`
              : 'No transactions found';

            const result = `
Litecoin Address Information
---------------------------------
Address: ${address}
Block: ${block}
First Block: ${firstblock}
First Seen: ${firstSeenDate}
Last Block: ${lastblock}
Last Seen: ${lastSeenDate}
Balance: ${(balance / 1e8).toFixed(8)} LTC
Total Received: ${(received / 1e8).toFixed(8)} LTC
Total Sent: ${(sent / 1e8).toFixed(8)} LTC
Rank: ${rankStatus}
---------------------------------
Total Transactions: ${totalTransactions}
---------------------------------
${highestTransaction}
${lowestTransaction}
---------------------------------
            `;

            await message.channel.send(`\`\`\`${result}\`\`\``);
          } catch (error) {
            console.error('Error parsing XHR response:', error);
            return message.channel.send('```Failed to retrieve and parse Litecoin address information. Please try again later.```');
          }
        }
      });

      await page.goto(url, { waitUntil: 'domcontentloaded' });

      // Adding delay to make sure response is handled before closing browser
      await page.waitFor(5000); // Wait for 5 seconds

      await browser.close();
      
    } catch (error) {
      console.error('Error fetching Litecoin address info:', error);
      if (error === "TypeError" && error.message.includes("page.waitForTimeout is not a function")) {
        return;
      }
    }
  },
};
