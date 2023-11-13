// Load the CSV data
d3.csv("merged_data1.csv").then(function(data) {
  // Prepare the data
  const yearCounts = {};

  // Filter data for EVs and Hybrids
  const filteredData = data.filter(d => d["Electric Vehicle Type"] === "Battery Electric Vehicle (BEV)" || d["Electric Vehicle Type"] === "Plug-in Hybrid Electric Vehicle (PHEV)");

  // Filter out the data for the year 2024
  const filteredYearData = filteredData.filter(d => d["Model Year"] !== "2024");

  filteredYearData.forEach(function(d) {
    const year = d["Model Year"];
    yearCounts[year] = (yearCounts[year] || 0) + 1;
  });

  // Create the line chart
  const chartData = Object.entries(yearCounts);

  // Debugging line
  console.log(chartData);

  const margin = { top: 20, right: 20, bottom: 30, left: 40 };
  const width = 800 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  const x = d3.scaleBand()
    .range([0, width])
    .padding(0.1)
    .domain(chartData.map(d => d[0]));

  const y = d3.scaleLinear()
    .range([height, 0])
    .domain([0, d3.max(chartData, d => d[1])]);

  const line = d3.line()
    .x(d => x(d[0]) + x.bandwidth() / 2)
    .y(d => y(d[1]));

  const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg.append("path")
    .datum(chartData)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 2)
    .attr("d", line);

  // Add axes
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "rotate(-45)")
    .style("text-anchor", "end");

  svg.append("g")
    .call(d3.axisLeft(y));
});
