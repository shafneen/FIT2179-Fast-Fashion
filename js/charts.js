// =============================================
// FILE: js/charts.js (DEBUG VERSION)
// Global Textile Exports Visualization
// =============================================

// Load and display both charts
async function loadAndDisplayCharts() {
  console.log("1. Script started - loading charts...");
  
  try {
    // Try multiple possible paths for the CSV file
    let csvData = null;
    let pathsToTry = [
      'data/wiki_exports_cleaned.csv',      // Original path
      '../data/wiki_exports_cleaned.csv',   // One level up
      'wiki_exports_cleaned.csv',            // Same folder
      './wiki_exports_cleaned.csv'           // Explicit current folder
    ];
    
    for (let path of pathsToTry) {
      try {
        console.log(`Trying to load: ${path}`);
        const response = await fetch(path);
        if (response.ok) {
          const csvText = await response.text();
          console.log(`✅ Successfully loaded from: ${path}`);
          
          // Parse CSV
          const lines = csvText.trim().split('\n');
          const headers = lines[0].split(',');
          csvData = [];
          
          for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',');
            const row = {
              country: values[0].trim(),
              trade_value: parseFloat(values[1]),
              share: parseFloat(values[2])
            };
            csvData.push(row);
          }
          
          console.log(`✅ Loaded ${csvData.length} countries`);
          break; // Exit loop if successful
        }
      } catch (err) {
        console.log(`Failed to load from ${path}`);
      }
    }
    
    if (!csvData) {
      throw new Error("Could not find CSV file in any expected location");
    }
    
    // Log first few rows to verify data
    console.log("Sample data (first 3 rows):", csvData.slice(0, 3));
    
    // Create both charts
    createChoropleth(csvData);
    createBarChart(csvData);
    
  } catch (error) {
    console.error('❌ Error loading data:', error);
    document.getElementById('choropleth').innerHTML = `<p style="color: red; text-align: center; padding: 50px;">
      ❌ Error: Could not load textile exports data.<br>
      Make sure wiki_exports_cleaned.csv is in the data folder.<br>
      Console error: ${error.message}
    </p>`;
  }
}

// =============================================
// CHART 1 — Choropleth Map
// =============================================
function createChoropleth(csvData) {
  console.log("Creating choropleth map...");
  
  const choroplethSpec = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "title": {
      "text": "Global Textile Export Value by Country",
      "subtitle": "Trade value in USD — darker colour = higher exports",
      "fontSize": 16,
      "subtitleFontSize": 12,
      "color": "#f0f0f0",
      "subtitleColor": "#aaa"
    },
    "width": "container",
    "height": 500,
    "background": "#1a1a1a",
    "projection": {"type": "naturalEarth1"},
    "data": {
      "url": "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson",
      "format": {"type": "json", "property": "features"}
    },
    "transform": [
      {
        "lookup": "properties.NAME",
        "from": {
          "data": {"values": csvData},
          "key": "country",
          "fields": ["trade_value", "share"]
        }
      }
    ],
    "mark": {"type": "geoshape", "stroke": "#444", "strokeWidth": 0.3},
    "encoding": {
      "color": {
        "field": "trade_value",
        "type": "quantitative",
        "scale": {"type": "log", "scheme": "orangered"},
        "legend": {
          "title": "Export Value (USD)",
          "format": "~s",
          "labelColor": "#f0f0f0",
          "titleColor": "#f0f0f0"
        }
      },
      "tooltip": [
        {"field": "properties.NAME", "type": "nominal", "title": "Country"},
        {"field": "trade_value", "type": "quantitative", "title": "Export Value (USD)", "format": ",.0f"},
        {"field": "share", "type": "quantitative", "title": "Global Share (%)", "format": ".2f"}
      ]
    }
  };
  
  vegaEmbed("#choropleth", choroplethSpec, {"actions": false})
    .then(() => console.log("✅ Choropleth map rendered"))
    .catch(error => {
      console.error("❌ Choropleth error:", error);
      document.getElementById('choropleth').innerHTML = `<p style="color: red; text-align: center; padding: 50px;">
        Choropleth map error: ${error.message}
      </p>`;
    });
}

// =============================================
// CHART 2 — Bar Chart: Top 20 Exporters
// =============================================
function createBarChart(csvData) {
  console.log("Creating bar chart...");
  
  // Sort and get top 20
  const top20 = [...csvData]
    .sort((a, b) => b.trade_value - a.trade_value)
    .slice(0, 20);
  
  console.log(`Top 20 countries ready: ${top20.length} items`);
  
  const barChartSpec = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "title": {
      "text": "Top 20 Textile Exporters",
      "subtitle": "By total export value (USD)",
      "fontSize": 16,
      "subtitleFontSize": 12,
      "color": "#f0f0f0",
      "subtitleColor": "#aaa"
    },
    "width": "container",
    "height": 400,
    "background": "#1a1a1a",
    "data": {"values": top20},
    "mark": {"type": "bar", "cornerRadiusEnd": 3},
    "encoding": {
      "y": {
        "field": "country",
        "type": "nominal",
        "sort": "-x",
        "title": null,
        "axis": {
          "labelColor": "#f0f0f0",
          "labelFontSize": 12,
          "labelLimit": 300
        }
      },
      "x": {
        "field": "trade_value",
        "type": "quantitative",
        "title": "Export Value (USD)",
        "axis": {
          "format": "~s",
          "labelColor": "#aaa",
          "titleColor": "#aaa",
          "gridColor": "#333"
        }
      },
      "color": {
        "field": "trade_value",
        "type": "quantitative",
        "scale": {"scheme": "orangered"},
        "legend": null
      },
      "tooltip": [
        {"field": "country", "type": "nominal", "title": "Country"},
        {"field": "trade_value", "type": "quantitative", "title": "Export Value (USD)", "format": ",.0f"},
        {"field": "share", "type": "quantitative", "title": "Global Share (%)", "format": ".2f"}
      ]
    }
  };
  
  vegaEmbed("#bar_chart", barChartSpec, {"actions": false})
    .then(() => console.log("✅ Bar chart rendered"))
    .catch(error => {
      console.error("❌ Bar chart error:", error);
      document.getElementById('bar_chart').innerHTML = `<p style="color: red; text-align: center; padding: 50px;">
        Bar chart error: ${error.message}
      </p>`;
    });
}

// =============================================
// START EVERYTHING
// =============================================
// Wait for the page to fully load first
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadAndDisplayCharts);
} else {
  loadAndDisplayCharts();
}
