// Set up the SVG container size
const svgWidth = 600;
const svgHeight = 400;

// Set up the SVG container
const svg = d3.select('#chart-container')
  .append('svg')
  .attr('width', svgWidth)
  .attr('height', svgHeight);

// Load data from CSV file
d3.csv('merged_data1.csv').then(data => {
  // Now 'data' contains your CSV data
  console.log(data);

  // Bar Chart

  // Count the occurrences of each make
  const makeCounts = {};
  for (let i = 0; i < data.length; i++) {
    const make = data[i].Make;
    makeCounts[make] = (makeCounts[make] || 0) + 1;
  }

  // Convert makeCounts object to an array
  const makeData = Object.entries(makeCounts).map(([make, count]) => ({ make, count }));

  // Set up the scales for the bar chart
  const xScale = d3.scaleBand().range([0, svgWidth]).padding(0.1)
    .domain(makeData.map(d => d.make));
  const yScale = d3.scaleLinear().range([svgHeight, 0])
    .domain([0, d3.max(makeData, d => d.count)]);

  // Create bars for the bar chart
  svg.selectAll('.bar')
    .data(makeData)
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('x', d => xScale(d.make))
    .attr('y', d => yScale(d.count))
    .attr('width', xScale.bandwidth())
    .attr('height', d => svgHeight - yScale(d.count))
    .attr('fill', '#4CAF50'); // Set the fill color for each bar

  // Line Chart

  // Group data by year and count the number of cars for each type
  const evData = data.filter(entry => entry['Electric Vehicle Type'].includes('Battery Electric Vehicle (BEV)'));
  const hybridData = data.filter(entry => entry['Electric Vehicle Type'].includes('Plug-in Hybrid Electric Vehicle (PHEV)'));
  const evCounts = countByYear(evData);
  const hybridCounts = countByYear(hybridData);
  const allData = mergeData(evCounts, hybridCounts);

  // Set up the scales for the line chart
  const lineXScale = d3.scaleBand().range([0, svgWidth]).padding(0.1)
    .domain(allData.map(d => d.year));
  const lineYScale = d3.scaleLinear().range([svgHeight, 0])
    .domain([0, d3.max(allData, d => d.count)]);

  // Create lines for the line chart
  createLine(evCounts, 'EV Line', 'Battery Electric Vehicle (BEV)', '#4CAF50');
  createLine(hybridCounts, 'Hybrid Line', 'Plug-in Hybrid Electric Vehicle (PHEV)', '#2196F3');

  // Add X-axis for both charts
  svg.append('g')
    .attr('transform', 'translate(0,' + svgHeight + ')')
    .call(d3.axisBottom(xScale))
    .selectAll('text')
    .attr('transform', 'rotate(-45)')
    .style('text-anchor', 'end');

  // Add Y-axis for the bar chart
  svg.append('g')
    .call(d3.axisLeft(yScale));

  // Add Y-axis for the line chart
  svg.append('g')
    .attr('transform', 'translate(' + svgWidth + ', 0)')
    .call(d3.axisRight(lineYScale));

  // Function to count the number of cars by year
  function countByYear(data) {
    const counts = {};
    data.forEach(entry => {
      const year = entry['Model Year'];
      counts[year] = (counts[year] || 0) + 1;
    });
    return Object.entries(counts).map(([year, count]) => ({ year, count }));
  }

  // Function to merge data for EVs and hybrids
  function mergeData(evData, hybridData) {
    const allData = [];
    evData.forEach(ev => {
      const hybrid = hybridData.find(hybrid => hybrid.year === ev.year);
      allData.push({
        year: ev.year,
        evCount: ev.count || 0,
        hybridCount: hybrid ? hybrid.count : 0,
      });
    });
    return allData;
  }

  // Function to create a line for EVs or hybrids
  function createLine(data, lineId, label, color) {
    const line = d3.line()
      .x(d => lineXScale(d.year))
      .y(d => lineYScale(d.count))
      .curve(d3.curveMonotoneX);

    svg.append('path')
      .data([data])
      .attr('class', 'line')
      .attr('id', lineId)
      .attr('d', line)
      .attr('stroke', color);

    // Add label for the line
    svg.append('text')
      .attr('transform', 'translate(' + (svgWidth - 10) + ',' + (lineYScale(data[data.length - 1].count) - 5) + ')')
      .attr('dy', '.35em')
      .attr('text-anchor', 'start')
      .style('fill', color)
      .text(label);
  }
}).catch(error => console.error('Error loading CSV:', error));
