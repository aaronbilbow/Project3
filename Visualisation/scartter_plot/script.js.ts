// Load the CSV data
d3.csv("merged_data1.csv").then(function(data) {
  // Prepare the data
  const chartData = data.map(function(d) {
      return {
          evPopulation: +d["Electric Range"], // Assuming "Electric Range" represents EV Population
          chargingStations: +d["EV Network"] // Assuming "EV Network" represents Number of Charging Stations
      };
  });

  // Create the scatter plot
  const margin = { top: 20, right: 20, bottom: 30, left: 40 };
  const width = 800 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  const x = d3.scaleLinear()
      .range([0, width])
      .domain([0, d3.max(chartData, d => d.evPopulation)]);

  const y = d3.scaleLinear()
      .range([height, 0])
      .domain([0, d3.max(chartData, d => d.chargingStations)]);

  const svg = d3.select("#scatter-plot")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg.selectAll(".dot")
      .data(chartData)
      .enter().append("circle")
      .attr("class", "dot")
      .attr("cx", d => x(d.evPopulation))
      .attr("cy", d => y(d.chargingStations))
      .attr("r", 5); // Adjust the radius as needed

  // Add axes
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  svg.append("g")
      .call(d3.axisLeft(y));

  // Add axis labels
  svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - height / 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Charging Stations");

  svg.append("text")
      .attr("transform", "translate(" + width / 2 + "," + (height + margin.top + 10) + ")")
      .style("text-anchor", "middle")
      .text("EV Population");
});
