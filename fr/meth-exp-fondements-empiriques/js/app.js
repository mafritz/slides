/**
 * Venn diagram of sources
 */

const sets = [
  { sets: ["Observations"], size: 10 },
  { sets: ["Simulations"], size: 10 },
  { sets: ["Expériences"], size: 10 },
  { sets: ["Observations", "Simulations"], size: 2 },
  { sets: ["Observations", "Expériences"], size: 2 },
  { sets: ["Simulations", "Expériences"], size: 2 },
  { sets: ["Observations", "Simulations", "Expériences"], size: 3 },
];
const chart = venn.VennDiagram().width(550).height(550);
d3.select("#source-venn").datum(sets).call(chart);

d3.selectAll("#source-venn .venn-circle path")
  .style("fill-opacity", 0)
  .style("stroke-width", 2)
  .style("stroke", "#000000");

d3.selectAll("#source-venn text")
  .style("fill", "#000000")
  .style("font-size", "32px");
