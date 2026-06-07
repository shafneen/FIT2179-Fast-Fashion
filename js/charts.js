// =============================================
// CHART 1 — Choropleth Map: Textile Exports
// =============================================
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
      "data": {"url": "data/wiki_exports_textiles.csv"},
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
          {"field": "trade_value", "type": "quantitative", "title": "Export Value (USD)", "format": ","},
          {"field": "share", "type": "quantitative", "title": "Global Share (%)", "format": ".2f"}
        ]
      }
    }
  ]
};

// =============================================
// CHART 2 — Bar Chart: Top 20 Exporters
// =============================================
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
  "data": {"url": "data/wiki_exports_textiles.csv"},
  "transform": [
    {
      "window": [{"op": "rank", "as": "rank"}],
      "sort": [{"field": "trade_value", "order": "descending"}]
    },
    {"filter": "datum.rank <= 20"}
  ],
  "mark": {"type": "bar", "cornerRadiusEnd": 3},
  "encoding": {
    "y": {
      "field": "country",
      "type": "nominal",
      "sort": "-x",
      "title": null,
      "axis": {"labelColor": "#f0f0f0", "labelFontSize": 12}
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
      {"field": "trade_value", "type": "quantitative", "title": "Export Value (USD)", "format": ","},
      {"field": "share", "type": "quantitative", "title": "Global Share (%)", "format": ".2f"}
    ]
  }
};

// =============================================
// EMBED ALL CHARTS
// =============================================
vegaEmbed("#choropleth", choroplethSpec, {"actions": false});
vegaEmbed("#bar_chart", barChartSpec, {"actions": false});
