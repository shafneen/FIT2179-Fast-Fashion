// Main chart loader - loads all data once and distributes to chart functions
window.chartData = {};

async function loadAllData() {
  try {
    // Load Dataset #2: Wikipedia Exports
    const response2 = await fetch('data/wiki_exports_cleaned.csv');
    const text2 = await response2.text();
    window.chartData.trade = parseCSV(text2, ['country', 'trade_value', 'share']);
    
    // Load Dataset #4: WageIndicator (adjust column names to match your CSV)
    const response4 = await fetch('data/wage_indicator.csv');
    const text4 = await response4.text();
    window.chartData.labour = parseCSV(text4);
    
    // Load Dataset #1: National Waste
    const response1 = await fetch('data/national_waste.csv');
    const text1 = await response1.text();
    window.chartData.waste = parseCSV(text1);
    
    // Load Dataset #5: Fast Fashion Data
    const response5 = await fetch('data/fast_fashion_data.csv');
    const text5 = await response5.text();
    window.chartData.consumer = parseCSV(text5);
    
    console.log('All data loaded:', window.chartData);
    
    // Render all charts
    if (typeof renderTradeCharts === 'function') renderTradeCharts();
    if (typeof renderLabourCharts === 'function') renderLabourCharts();
    if (typeof renderWasteCharts === 'function') renderWasteCharts();
    if (typeof renderConsumerCharts === 'function') renderConsumerCharts();
    
  } catch (error) {
    console.error('Error loading data:', error);
  }
}

// Helper: Parse CSV with headers
function parseCSV(csvText, customHeaders = null) {
  const lines = csvText.trim().split('\n');
  const headers = customHeaders || lines[0].split(',');
  const data = [];
  
  for (let i = customHeaders ? 0 : 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    const row = {};
    for (let j = 0; j < headers.length; j++) {
      let value = values[j]?.trim();
      // Try to convert to number if possible
      if (!isNaN(value) && value !== '') value = parseFloat(value);
      row[headers[j]] = value;
    }
    data.push(row);
  }
  return data;
}

// Start loading when page is ready
document.addEventListener('DOMContentLoaded', loadAllData);
