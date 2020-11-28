var trace1 = {
  x: ["Idéal", "Novices", "Experts", "Vous"],
  y: [70, 5, 20, 0],
  name: "Créer quelque chose d'utile",
  type: "bar",
};

var trace2 = {
  x: ["Idéal", "Novices", "Experts", "Vous"],
  y: [20, 40, 50, 0],
  name: "Lire code/documentation",
  type: "bar",
};

var trace3 = {
  x: ["Idéal", "Novices", "Experts", "Vous"],
  y: [10, 55, 30, 0],
  name: "Tester/débuger",
  type: "bar",
};

var data = [trace1, trace2, trace3];

var layout = { barmode: "stack" };

var config = {
  responsive: true,
  displayModeBar: true,
  editable: false,
  displaylogo: true,
};

Plotly.newPlot("time-repartition-graph", data, layout, config);

document.querySelectorAll("#you-time-values input").forEach(function (el) {
  el.addEventListener("change", function () {
    console.log("Ok");
    trace1.y[3] = Number(document.getElementById("you-time-dev").value);
    trace2.y[3] = Number(document.getElementById("you-time-doc").value);
    trace3.y[3] = Number(document.getElementById("you-time-test").value);
    data = [trace1, trace2, trace3];
    Plotly.newPlot("time-repartition-graph", data, layout, config);
  });
});
