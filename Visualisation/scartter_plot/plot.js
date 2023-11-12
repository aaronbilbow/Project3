// Read the CSV data and create the scatter plot
d3.csv("merged_data1.csv").then(function (data) {
    // Set up SVG dimensions
    let margin = { top: 20, right: 20, bottom: 70, left: 70 },
      width = 800 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;
  
    // Create SVG element
    let svg = d3.select("#chart-container").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
    // Create scales for latitude and longitude
    let latScale = d3.scaleLinear().domain([d3.min(data, d => +d.Latitude), d3.max(data, d => +d.Latitude)]).range([0, width]);
    let lonScale = d3.scaleLinear().domain([d3.min(data, d => +d.Longitude), d3.max(data, d => +d.Longitude)]).range([height, 0]);
  
    // Create axes for latitude and longitude
    let latAxis = d3.axisBottom().scale(latScale);
    let lonAxis = d3.axisLeft().scale(lonScale);
  
    // Append axes to the SVG
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(latAxis)
      .append("text")
      .attr("class", "x-axis-label")
      .attr("x", width / 2)
      .attr("y", 40)
      .style("text-anchor", "middle")
      .text("Latitude");
  
    svg.append("g")
      .call(lonAxis)
      .append("text")
      .attr("class", "y-axis-label")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", -50)
      .style("text-anchor", "middle")
      .text("Longitude");
  
    // Use a for loop to iterate through each row in the data
    for (let i = 0; i < data.length; i++) {
      let entry = data[i];
  
      // Plot EV location
      svg.append("circle")
        .attr("class", "ev-location")
        .attr("cx", latScale(+entry.Latitude))
        .attr("cy", lonScale(+entry.Longitude))
        .attr("r", 5)
        .style("fill", "green") 
        .style("stroke", "black"); 
  
      // Plot charging station location
      svg.append("circle")
        .attr("class", "charging-station-location")
        .attr("cx", latScale(+entry.Latitude))
        .attr("cy", lonScale(+entry.Longitude))
        .attr("r", 5)
        .style("fill", "blue") 
        .style("stroke", "black"); 
    }
  });
  