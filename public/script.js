document.getElementById('stockForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const ticker = document.getElementById('ticker').value;
  const startDate = document.getElementById('startDate').value;
  const businessDays = document.getElementById('businessDays').value;

  const response = await fetch('/fetch-stock-data', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ticker, startDate, businessDays }),
  });

  const result = await response.json();
  displayResults(result);
});

function displayResults({ dates, closingPrices, cumulativeReturns }) {
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = '';

  const title = document.createElement('h2');
  title.textContent = 'Stock Data Results';
  resultsDiv.appendChild(title);

  const table = document.createElement('table');
  const headerRow = document.createElement('tr');

  const dateHeader = document.createElement('th');
  dateHeader.textContent = 'Date';
  headerRow.appendChild(dateHeader);

  const priceHeader = document.createElement('th');
  priceHeader.textContent = 'Closing Price';
  headerRow.appendChild(priceHeader);

  const returnHeader = document.createElement('th');
  returnHeader.textContent = 'Cumulative Return';
  headerRow.appendChild(returnHeader);

  table.appendChild(headerRow);

  dates.forEach((date, index) => {
    const row = document.createElement('tr');

    const dateCell = document.createElement('td');
    dateCell.textContent = date;
    row.appendChild(dateCell);

    const priceCell = document.createElement('td');
    priceCell.textContent = closingPrices[date].toFixed(2);
    row.appendChild(priceCell);

    const returnCell = document.createElement('td');
    returnCell.textContent = (cumulativeReturns[index] * 100).toFixed(2) + '%';
    row.appendChild(returnCell);

    table.appendChild(row);
  });

  resultsDiv.appendChild(table);
}
