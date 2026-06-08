// Charts 1-3: Global Trade section

function renderTradeCharts() {
  const data = window.chartData.trade;
  if (!data) return;
  
  // Fix country names for GeoJSON
  const mapData = data.map(d => ({
    country: d.country === 'United States' ? 'United States of America' :
             d.country === 'Czech Republic' ? 'Czechia' : d.country,
    trade_value: d.trade_value
  }));
  
  // Chart 1: Choropleth Map
  const choroplethSpec = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "title": {"text": "Global Textile Export Value", "color": "#f0f0f0"},
    "width": "container", "height": 450, "background": "#1a1a1a",
    "projection": {"type": "naturalEarth1"},
    "layer": [
      {"data": {"url": "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson", "format": {"type": "json", "property": "features"}}, "mark": {"type": "geoshape", "fill": "#2a2a2a", "stroke": "#444"}},
      {"data": {"values": mapData}, "transform": [{"lookup": "country", "from": {"data": {"url": "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson", "format": {"type": "json", "property": "features"}}, "key": "properties.NAME", "fields": ["geometry"]}}], "mark": {"type": "geoshape", "stroke": "#444"}, "encoding": {"shape": {"field": "geometry", "type": "geojson"}, "color": {"field": "trade_value", "type": "quantitative", "scale": {"type": "log", "scheme": "orangered"}, "legend": {"title": "USD"}}, "tooltip": [{"field": "country", "type": "nominal"}, {"field": "trade_value", "type": "quantitative", "format": ",.0f"}]}}
    ]};
  
  // Chart 2: Ranked Horizontal Bar
  const top20 = [...data].sort((a,b) => b.trade_value - a.trade_value).slice(0,20);
  const barSpec = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "title": "Top 20 Textile Exporters", "width": "container", "height": 400, "background": "#1a1a1a",
    "data": {"values": top20}, "mark": {"type": "bar", "cornerRadiusEnd": 3},
    "encoding": {"y": {"field": "country", "type": "nominal", "sort": "-x", "axis": {"labelColor": "#f0f0f0"}}, "x": {"field": "trade_value", "type": "quantitative", "title": "USD", "axis": {"format": "~s"}}, "color": {"field": "trade_value", "type": "quantitative", "scale": {"scheme": "orangered"}}, "tooltip": [{"field": "country"}, {"field": "trade_value", "format": ",.0f"}]}
  };
  
  // Chart 3: Diverging Bar (showing surplus/deficit relative to median)
  const median = data.sort((a,b) => a.trade_value - b.trade_value)[Math.floor(data.length/2)].trade_value;
  const divergingData = data.slice(0,30).map(d => ({...d, deviation: d.trade_value - median}));
  const divSpec = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "title": "Deviation from Median Export Value", "width": "container", "height": 400, "background": "#1a1a1a",
    "data": {"values": divergingData}, "mark": "bar",
    "encoding": {"y": {"field": "country", "type": "nominal", "sort": "-x"}, "x": {"field": "deviation", "type": "quantitative", "title": "Above/Below Median (USD)"}, "color": {"condition": {"test": "datum.deviation > 0", "value": "#ff6b35"}, "value": "#4a4a4a"}, "tooltip": [{"field": "country"}, {"field": "deviation", "format": ",.0f"}]}
  };
  
  vegaEmbed("#chart1_choropleth", choroplethSpec, {"actions": false});
  vegaEmbed("#chart2_ranked_bar", barSpec, {"actions": false});
  vegaEmbed("#chart3_diverging_bar", divSpec, {"actions": false});
}

// Register with the main loader
window.renderTradeCharts = renderTradeCharts;
