/**
 * Small target example
 */
var startTime;
var endTime;

$("#drag-robot-small").draggable({
  revert: "invalid",
  cursor: "move",
  snap: true,
  start: function () {
    startTime = new Date();
  },
});
$("#drop-robot-small").droppable({
  accept: "#drag-robot-small",
  tolerance: "fit",
  drop: function (event, ui) {
    endTime = new Date();
    let diffTime = Math.abs(endTime - startTime) / 1000;
    document.getElementById(
      "drag-robot-small-time"
    ).innerHTML = `Temps pour l'opération : <strong>${diffTime}</strong> seconds.`;
    ui.draggable.addClass("text-white");
    $("#drop-robot-small").switchClass("bg-danger", "bg-success", 0);
    $("#drag-robot-small-feedback").css({ visibility: "visible" });
  },
});

document
  .getElementById("drag-robot-small-reset-btn")
  .addEventListener("click", function () {
    let obj = $("#drag-robot-small");
    let target = $("#drop-robot-small");
    obj.removeClass("text-white");
    obj.draggable("enable");
    obj.css({
      left: 0,
      top: 0,
    });
    target.switchClass("bg-success", "bg-danger", 0);
    $("#drag-robot-small-feedback").css({ visibility: "hidden" });
  });

/**
 * Big target example
 */
var startTime;
var endTime;
$("#drag-robot-big").draggable({
  revert: "invalid",
  cursor: "move",
  snap: true,
  start: function () {
    startTime = new Date();
  },
});
$("#drop-robot-big").droppable({
  accept: "#drag-robot-big",
  tolerance: "fit",
  drop: function (event, ui) {
    endTime = new Date();
    let diffTime = Math.abs(endTime - startTime) / 1000;
    document.getElementById(
      "drag-robot-big-time"
    ).innerHTML = `Temps pour l'opération : <strong>${diffTime}</strong> seconds.`;
    ui.draggable.addClass("text-white");
    $("#drop-robot-big").switchClass("bg-danger", "bg-success", 0);
    $("#drag-robot-big-feedback").css({ visibility: "visible" });
  },
});

document
  .getElementById("drag-robot-big-reset-btn")
  .addEventListener("click", function () {
    let obj = $("#drag-robot-big");
    let target = $("#drop-robot-big");
    obj.removeClass("text-white");
    obj.draggable("enable");
    obj.css({
      left: 0,
      top: 0,
    });
    target.switchClass("bg-success", "bg-danger", 0);
    $("#drag-robot-big-feedback").css({ visibility: "hidden" });
  });

/**
 * Relation item-conteneur
 */

$("div[data-draggable-items] > div").draggable({
  revert: "invalid",
});

$("div[data-accept-tense='present']").droppable({
  accept: "[data-tense='present']",
  drop: function (event, ui) {
    ui.draggable.addClass("bg-success text-white");
    ui.draggable.draggable("disable");
  },
});

$("div[data-accept-tense='past']").droppable({
  accept: "[data-tense='past']",
  drop: function (event, ui) {
    ui.draggable.addClass("bg-success text-white");
    ui.draggable.draggable("disable");
  },
});

/**
 * Approximation
 */
$("[data-cities] li").draggable({
  axis: "x",
  //containment: "#cities-drag-drop",
  drag: function (event, ui) {
    let distance = Math.round(
      (ui.position.left * 600) / $("#cities-drag-drop").width()
    );
    event.target.querySelector("[data-current-distance]").innerHTML = distance;
    event.target.setAttribute("data-current-distance", distance);
    event.target.querySelector("[data-diff-distance]").innerHTML = "";
  },
});

document
  .getElementById("cities-verify-btn")
  .addEventListener("click", function () {
    document.querySelectorAll("[data-cities] li").forEach(function (el) {
      let guessedDistance = el.getAttribute("data-current-distance");
      let trueDistance = el.getAttribute("data-true-distance");
      console.log(trueDistance);
      let diffDistance = guessedDistance - trueDistance;
      let showFeedback = el.querySelector("[data-diff-distance]");
      if (diffDistance == 0) {
        showFeedback.className = "text-success";
        showFeedback.innerHTML = `<i class="fa fa-check" style="padding-left: 40px"></i>`;
      } else if (diffDistance > 0) {
        showFeedback.className = "text-error";
        showFeedback.innerHTML = `(+${diffDistance})`;
      } else {
        showFeedback.className = "text-error";
        showFeedback.innerHTML = `(${diffDistance})`;
      }
    });
  });

document
  .getElementById("cities-reset-btn")
  .addEventListener("click", function () {
    document.querySelectorAll("[data-cities] li").forEach(function (el) {
      el.style.left = 0;
      el.querySelector("[data-current-distance]").innerHTML = 0;
      el.setAttribute("data-current-distance", 0);
      el.querySelector("[data-diff-distance]").innerHTML = "";
    });
  });

/**
 * Correspondance visuo-spatiale
 */
$("#hockey-schema-objects > div").draggable({
  cursor: "move",
  containment: "[data-container='hockey-whiteboard']",
});

$("#hockey-schema-rink").droppable({
  accept: "#hockey-schema-objects > div",
  drop: function (event, ui) {
    console.log(ui.draggable);
    ui.draggable
      .find("div")
      .switchClass("bg-dark", "bg-danger", 500)
      .switchClass("bg-danger", "bg-dark", 500);
  },
});
