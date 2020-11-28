/**
 * Example from https://www.graphery.org/svg/examples/clock.html
 * Slightly adapted by MAF 27/11/2020
 */

const svg = gySVG().viewBox("0 0 250 250");

svg
  .add("circle")
  .cx(125)
  .cy(125)
  .r(124)
  .stroke("#000")
  .stroke_width(2)
  .fill("none");

let h = 1;
for (let n = 6; n <= 360; n += 6) {
  const radians = ((n - 90) * Math.PI) / 180.0;
  let radio;
  if (n % 30 === 0) {
    radio = 110;
    svg
      .add("text")
      .fill("#000")
      .innerHTML(h++)
      .x(125 + 95 * Math.cos(radians))
      .y(132 + 95 * Math.sin(radians))
      .style.fontSize(20)
      .style.fontWeight(900)
      .style.fontFamily("Crimson Pro")
      .text_anchor("middle");
  } else {
    radio = 115;
  }
  svg
    .add("line")
    .x1(125 + 120 * Math.cos(radians))
    .y1(125 + 120 * Math.sin(radians))
    .x2(125 + radio * Math.cos(radians))
    .y2(125 + radio * Math.sin(radians))
    .stroke("#000000")
    .stroke_width(n % 30 === 0 ? 3 : 1);
}

const g = svg.add("g").fill("#000");

const hours = g
  .add("polygon")
  .points([125, 55], [132, 125], [125, 160], [118, 125]);

const minutes = g
  .add("polygon")
  .points([125, 15], [130, 125], [125, 150], [120, 125]);

const seconds = g.add("g").fill("#970000");
seconds
  .add("polygon")
  .points([125, 40], [129, 125], [125, 145], [124, 125])
  .fill("#970000");

seconds.add("circle").cx(125).cy(50).r(10);

svg.attachTo("#example-clock");

setInterval(
  (function update() {
    const d = new Date();
    seconds.transform(`rotate(${d.getSeconds() * 6}, 125, 125)`);
    minutes.transform(`rotate(${d.getMinutes() * 6}, 125, 125)`);
    hours.transform(
      `rotate(${(d.getHours() % 12) * 30 + d.getMinutes() * 0.5}, 125, 125)`
    );
    return update;
  })(),
  1000
);
