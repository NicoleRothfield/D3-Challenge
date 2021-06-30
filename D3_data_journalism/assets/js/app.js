// @TODO: YOUR CODE HERE!
/********************************************************/
const datafile = "D3_data_journalism/assets/data/data.csv";
/********************************************************/
// Define SVG area dimensions
const svgWidth = 960;
const svgHeight = 660;
/********************************************************/
// Define the chart's margins as an object
const chartMargin = {
  top: 30,
  right: 40,
  bottom: 80,
  left: 100,
};
/********************************************************/
// Define dimensions of the chart area
const chartWidth = svgWidth - chartMargin.left - chartMargin.right;
const chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;
/********************************************************/
// Select body, append SVG area to it, and set the dimensions
const svg = d3.select("body").append("svg").attr("height", svgHeight).attr("width", svgWidth);
/********************************************************/
const chartGroup = svg
  .append("g")
  .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);
/********************************************************/
d3.csv(datafile, rowUpdate).then(createChart);
/********************************************************/
function rowUpdate(row) {
  row.healthcare = +row.healthcare;
  row.poverty = +row.poverty;
  return row;
}
/********************************************************/
function createChart(data) {
  console.table(data, ["abbr", "healthcare", "poverty"]);
  let yLinearScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.healthcare)])
    .range([chartHeight, 0]);
  let xLinearScale = d3
    .scaleLinear()
    .domain([8, d3.max(data, (d) => d.poverty)])
    .range([0, chartWidth]);
  //comment these lines to add the axis
  let bottomAxis = d3.axisBottom(xLinearScale);
  
  let leftAxis = d3.axisLeft(yLinearScale);
  
  chartGroup.append("g").call(leftAxis);
 
  chartGroup.append("g").call(bottomAxis).attr("transform", `translate(0, ${chartHeight})`);
  
  chartGroup
    .append("text")
    .attr("class", "axisText")
    .text("Lacks Healthcare (%)")
    .attr("transform", ` translate(-40, ${chartHeight / 2}) rotate(-90) scale(1.2) `);
  
    chartGroup
    .append("text")
    .attr("x", chartWidth / 2)
    .attr("y", chartHeight + chartMargin.top + 20)
    .attr("class", "axisText")
    .text("In Poverty (%)");

   var circlesGroup = chartGroup
    .selectAll(".stateCircle")
    .data(data)
    .enter()
    .append("circle")
    .classed("stateCircle", true)
    .attr("cx", (d) => xLinearScale(d.poverty))
    .attr("cy", (d) => yLinearScale(d.healthcare))
    .attr("r",10)
    .attr("opacity", ".75");
  
  
    //chart label instructions https://stackoverflow.com/questions/55988709/how-can-i-add-labels-inside-the-points-in-a-scatterplot  
    chartGroup.selectAll(null)
    .data(data)
    .enter()
    .append("text")
    .text(function(d){
        console.log(d.abbr)
        return `${d.abbr}`;
    })
    .attr("x", function(d){
        return xLinearScale(d.poverty);
    })
    .attr("y", function(d){
        return yLinearScale(d.healthcare);
    })
    .attr("text-anchor", "middle")
    .attr("fill", "white")
    .attr("font-size", "7px");


}


/********************************************************/