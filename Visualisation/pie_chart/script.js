// script.js
d3.csv('merged_data1.csv').then(function(data) {
  // Parse the data and count public and private charging stations
  let chargingStationCounts = {
    public: 0,
    private: 0
  };

  data.forEach(function(station) {
    if (station['Facility Type'] === 'Public') {
      chargingStationCounts.public++;
    } else if (station['Facility Type'] === 'Private') {
      chargingStationCounts.private++;
    }
  });

  // Create a pie chart
  let width = 400;
  let height = 400;
  let radius = Math.min(width, height) / 2;

  let color = d3.scaleOrdinal(['#1f77b4', '#ff7f0e']);

  let svg = d3.select('#chart')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

  let pie = d3.pie().value(function(d) {
    return d.value;
  });

  let data_ready = pie(Object.entries(chargingStationCounts));

  // Create arcs for the pie chart
  let arc = d3.arc()
    .innerRadius(0)
    .outerRadius(radius);

  // Append paths for each data point
  svg.selectAll('path')
    .data(data_ready)
    .enter()
    .append('path')
    .attr('d', arc)
    .attr('fill', function(d) {
      return color(d.data[0]); // d.data[0] is the key
    })
    .attr('stroke', 'black')
    .style('stroke-width', '2px')
    .style('opacity', 0.7);
});
