// =============================================
// FILE: js/charts.js
// Global Textile Exports Visualization
// =============================================

async function loadAndDisplayCharts() {
  try {
    // Load your CSV data
    const response = await fetch('data/wiki_exports_cleaned.csv');
    const csvText = await response.text();
    
    // Parse CSV
    const lines = csvText.trim().split('\n');
    const data = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      let countryName = values[0].trim();
      
      // Fix country names to match GeoJSON
      if (countryName === "United States") countryName = "United States of America";
      if (countryName === "Czech Republic") countryName = "Czechia";
      if (countryName === "South Korea") countryName = "South Korea";
      if (countryName === "United Kingdom") countryName = "United Kingdom";
      
      data.push({
        country: countryName,
        trade_value: parseFloat(values[1])
      });
    }
    
    console.log(`Loaded ${data.length} countries`);
    
    // Create the choropleth map using your working structure
    const choroplethSpec = {
      "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
      "title": {
        "text": "Global Textile Export Value by Country",
        "subtitle": "Trade value in USD — darker = higher exports",
        "fontSize": 16,
        "subtitleFontSize": 12,
        "color": "#f0f0f0",
        "subtitleColor": "#aaa"
      },
      "width": "container",
      "height": 450,
      "background": "#1a1a1a",
      "projection": {"type": "naturalEarth1"},
      "layer": [
        {
          "data": {
            "url": "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson",
            "format": {"type": "json", "property": "features"}
          },
          "mark": {"type": "geoshape", "fill": "#2a2a2a", "stroke": "#444", "strokeWidth": 0.5}
        },
        {
          "data": {"values": data},
          "transform": [
            {
              "lookup": "country",
              "from": {
                "data": {
                  "url": "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson",
                  "format": {"type": "json", "property": "features"}
                },
                "key": "properties.NAME",
                "fields": ["type", "geometry", "properties"]
              }
            }
          ],
          "mark": {"type": "geoshape", "stroke": "#444", "strokeWidth": 0.3},
          "encoding": {
            "shape": {"field": "geometry", "type": "geojson"},
            "color": {
              "field": "trade_value",
              "type": "quantitative",
              "scale": {"type": "log", "scheme": "orangered"},
              "legend": {"title": "Export Value (USD)", "format": "~s", "labelColor": "#f0f0f0", "titleColor": "#f0f0f0"}
            },
            "tooltip": [
              {"field": "country", "type": "nominal", "title": "Country"},
              {"field": "trade_value", "type": "quantitative", "title": "Export Value (USD)", "format": ",.0f"}
            ]
          }
        }
      ]
    };
    
    // Create bar chart for top 20
    const top20 = [...data]
      .sort((a, b) => b.trade_value - a.trade_value)
      .slice(0, 20);
    
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
          "axis": {"labelColor": "#f0f0f0", "labelFontSize": 12, "labelLimit": 300}
        },
        "x": {
          "field": "trade_value",
          "type": "quantitative",
          "title": "Export Value (USD)",
          "axis": {"format": "~s", "labelColor": "#aaa", "titleColor": "#aaa", "gridColor": "#333"}
        },
        "color": {
          "field": "trade_value",
          "type": "quantitative",
          "scale": {"scheme": "orangered"},
          "legend": null
        },
        "tooltip": [
          {"field": "country", "type": "nominal", "title": "Country"},
          {"field": "trade_value", "type": "quantitative", "title": "Export Value (USD)", "format": ",.0f"}
        ]
      }
    };
    
    // Embed both charts
    vegaEmbed("#choropleth", choroplethSpec, {"actions": false})
      .then(() => console.log("✅ Choropleth map loaded"));
      
    vegaEmbed("#bar_chart", barChartSpec, {"actions": false})
      .then(() => console.log("✅ Bar chart loaded"));
    
  } catch (error) {
    console.error("Error:", error);
    document.getElementById('choropleth').innerHTML = `<p style="color: red; padding: 50px; text-align: center;">
      Error loading data: ${error.message}<br>
      Make sure wiki_exports_cleaned.csv is in the data folder
    </p>`;
  }
}

// Start everything when page loads
document.addEventListener('DOMContentLoaded', loadAndDisplayCharts);
