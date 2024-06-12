const express = require('express');
const yf = require('yfinance');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());

// Function to calculate end date based on business days
const calculateEndDate = (startDate, businessDays) => {
  let currentDate = new Date(startDate);
  while (businessDays > 0) {
    currentDate.setDate(currentDate.getDate() + 1);
    if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
      businessDays--;
    }
  }
  return currentDate.toISOString().split('T')[0];
};

// Route to fetch stock data
app.post('/fetch-stock-data', async (req, res) => {
  const { ticker, startDate, businessDays } = req.body;
  const endDate = calculateEndDate(startDate, businessDays);

  try {
    const stockData = await yf.download({
      symbol: ticker,
      from: startDate,
      to: endDate
    });

    const closingPrices = stockData['Close'];
    const dates = Object.keys(closingPrices);
    const cumulativeReturns = dates.map((date, index) => {
      if (index === 0) return 0;
      const prevClose = closingPrices[dates[0]];
      return (closingPrices[date] / prevClose) - 1;
    });

    res.json({ dates, closingPrices, cumulativeReturns });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching stock data' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
