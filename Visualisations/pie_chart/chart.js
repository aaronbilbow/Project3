// Read the CSV data and create the pie chart
d3.csv("merged_data1.csv").then(function(data) {
  // Process data
  let publicStations = data.filter(function(d) {
    return d['Access Code'] === 'public';
  });

  let privateStations = data.filter(function(d) {
    return d['Access Code'] === 'private';
  });

  let publicCount = publicStations.length;
  let privateCount = privateStations.length;

  // Calculate total count
  let totalCount = publicCount + privateCount;

  // Create the pie chart
  let width = 400;
  let height = 400;
  let radius = Math.min(width, height) / 2;

  let color = d3.scaleOrdinal(["#4CAF50", "#2196F3"]); // Green for public, Blue for private

  let pie = d3.pie();

  let arc = d3.arc()
    .outerRadius(radius - 10)
    .innerRadius(0);

  let svg = d3.select("#chart-container").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  let dataForPie = [publicCount, privateCount];

  let arcs = svg.selectAll("arc")
    .data(pie(dataForPie))
    .enter()
    .append("g")
    .attr("class", "arc");

  arcs.append("path")
    .attr("fill", function(d, i) {
      return color(i);
    })
    .attr("d", arc);

  arcs.append("text")
    .attr("transform", function(d) {
      let centroid = arc.centroid(d);
      return "translate(" + centroid[0] + "," + centroid[1] + ")";
    })
    .attr("text-anchor", "middle")
    .text(function(d) {
      let percentage = ((d.value / totalCount) * 100).toFixed(2) + "%";
      return percentage;
    });

  // Create legend
  let legend = svg.selectAll(".legend")
    .data(color.domain())
    .enter().append("g")
    .attr("class", "legend")
    .attr("transform", function(_, i) {
      return "translate(0," + (i * 20) + ")";
    });

  legend.append("rect")
    .attr("x", width / 2 - 18)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", color);

  legend.append("text")
    .attr("x", width / 2 - 24)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "end")
    .text(function(_, i) {
      return i === 0 ? "Public" : "Private";
    });
});
