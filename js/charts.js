// =============================================
// CHART 1 — Choropleth Map: Textile Exports
// =============================================
const choroplethSpec = {
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "title": {
    "text": "Global Textile Export Value by Country",
    "subtitle": "Trade value in USD — darker = higher exports",
    "fontSize": 16,
    "subtitleFontSize": 12
  },
  "width": 800,
  "height": 450,
  "projection": {"type": "naturalEarth1"},
  "layer": [
    {
      "data": {
        "url": "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson",
        "format": {"type": "json", "property": "features"}
      },
      "mark": {"type": "geoshape", "fill": "#e8e8e8", "stroke": "#ccc", "strokeWidth": 0.5}
    },
    {
      "data": {
        "values": [
          {"country": "China", "trade_value": 267717841},
          {"country": "Bangladesh", "trade_value": 45964126},
          {"country": "Vietnam", "trade_value": 41355461},
          {"country": "Germany", "trade_value": 39440350},
          {"country": "Italy", "trade_value": 38328783},
          {"country": "India", "trade_value": 36216984},
          {"country": "Turkey", "trade_value": 33551489},
          {"country": "United States of America", "trade_value": 25171304},
          {"country": "Pakistan", "trade_value": 17921593},
          {"country": "Spain", "trade_value": 17791873},
          {"country": "France", "trade_value": 17599574},
          {"country": "Netherlands", "trade_value": 14892235},
          {"country": "Indonesia", "trade_value": 12884585},
          {"country": "Cambodia", "trade_value": 11748858},
          {"country": "Belgium", "trade_value": 10116113},
          {"country": "Japan", "trade_value": 7940196},
          {"country": "United Kingdom", "trade_value": 7514836},
          {"country": "Poland", "trade_value": 7462718},
          {"country": "Mexico", "trade_value": 7352356},
          {"country": "South Korea", "trade_value": 7078866},
          {"country": "Thailand", "trade_value": 6864877},
          {"country": "Portugal", "trade_value": 6631311},
          {"country": "Myanmar", "trade_value": 6033967},
          {"country": "Morocco", "trade_value": 5915414},
          {"country": "Sri Lanka", "trade_value": 5639688},
          {"country": "Australia", "trade_value": 5380166},
          {"country": "Egypt", "trade_value": 5218423},
          {"country": "Czechia", "trade_value": 5107068},
          {"country": "Austria", "trade_value": 4995604},
          {"country": "Romania", "trade_value": 4819320},
          {"country": "Denmark", "trade_value": 4761832},
          {"country": "Tunisia", "trade_value": 4119289},
          {"country": "Brazil", "trade_value": 4096508},
          {"country": "Switzerland", "trade_value": 4038662},
          {"country": "Uzbekistan", "trade_value": 3822608},
          {"country": "United Arab Emirates", "trade_value": 3670480},
          {"country": "Honduras", "trade_value": 3135540},
          {"country": "Canada", "trade_value": 3089459},
          {"country": "Malaysia", "trade_value": 2800140},
          {"country": "Sweden", "trade_value": 2770414},
          {"country": "Bulgaria", "trade_value": 2671922},
          {"country": "Jordan", "trade_value": 2515846},
          {"country": "El Salvador", "trade_value": 2361899},
          {"country": "Guatemala", "trade_value": 2040315},
          {"country": "Hungary", "trade_value": 2025242},
          {"country": "Nicaragua", "trade_value": 1957928},
          {"country": "Slovakia", "trade_value": 1913140},
          {"country": "Greece", "trade_value": 1771637},
          {"country": "Lithuania", "trade_value": 1676424},
          {"country": "Peru", "trade_value": 1654649},
          {"country": "Singapore", "trade_value": 1431395},
          {"country": "Philippines", "trade_value": 1314755},
          {"country": "South Africa", "trade_value": 1297317},
          {"country": "Serbia", "trade_value": 1230872},
          {"country": "Croatia", "trade_value": 1207331}
        ]
      },
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
      "mark": {"type": "geoshape", "stroke": "#ccc", "strokeWidth": 0.3},
      "encoding": {
        "shape": {"field": "geometry", "type": "geojson"},
        "color": {
          "field": "trade_value",
          "type": "quantitative",
          "scale": {"type": "log", "scheme": "orangered"},
          "legend": {"title": "Export Value (USD)", "format": "~s"}
        },
        "tooltip": [
          {"field": "country", "type": "nominal", "title": "Country"},
          {"field": "trade_value", "type": "quantitative", "title": "Export Value (USD)", "format": ","}
        ]
      }
    }
  ]
}

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
