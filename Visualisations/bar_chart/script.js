// Load the CSV data
d3.csv("merged_data1.csv").then(function(data) {
  // Prepare the data
  const makeCounts = {};
  data.forEach(function(d) {
    const make = d.Make;
    makeCounts[make] = (makeCounts[make] || 0) + 1;
  });

  // Create the bar chart
  let chartData = Object.entries(makeCounts);

  // Sort the data in descending order based on count
  chartData = chartData.sort((a, b) => b[1] - a[1]);

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

  const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg.selectAll(".bar")
    .data(chartData)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", d => x(d[0]))
    .attr("width", x.bandwidth())
    .attr("y", d => y(d[1]))
    .attr("height", d => height - y(d[1]));

  // Add axes
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text") // Select all the text elements for styling
    .attr("transform", "rotate(-45)") // Rotate the x-axis labels
    .style("text-anchor", "end"); // Align the text to the end of the rotation

  svg.append("g")
    .call(d3.axisLeft(y));
});