var app = angular.module("demoApp", ["ngRoute"]);

app.controller(
  "DynamicEmotionWheelCtrl",
  function (
    $scope,
    $http,
    $location,
    GraphService,
    SharedEmotionsService,
    Algorithm
  ) {
    $scope.loading = true;
    $scope.dewShowFeedback = false;
    $scope.dewShowInstructions = true;
    $scope.dewShowButtons = false;
    $scope.id = $location.path().substring(1);
    $scope.switchID = $scope.id;
    //Load configuration
    $http.get("./app/json/configurations.json").then(
      function (response) {
        $scope.circumplexes = response.data;
        if ($scope.id !== "") {
          $scope.config = _.findWhere($scope.circumplexes, { id: $scope.id });
        }
        console.log(response);
        console.log($scope.config);
      },
      function (response) {
        console.log(response);
      }
    );

    //Set initial slider
    $scope.slideX = {
      value: 0,
      last: 0,
      lastOther: 0,
    };
    $scope.slideY = {
      value: 0,
      last: 0,
      lastOther: 0,
    };
    //Set buttons number
    $scope.lastSlideModified = null;
    $scope.lastSendEmotion = null;
    $scope.onSlideChange = function (slide) {
      $scope.lastSlideModified = slide;
      //$scope.sortEmotions();
      $scope.dewShowFeedback = false;
      $scope.dewShowInstructions = false;
      $scope.dewShowButtons = true;
    };
    //Confirm same slide values
    $scope.confirmSlideValue = function () {
      $scope.dewShowFeedback = false;
      $scope.dewShowButtons = true;
    };
    //Order emotions
    $scope.orderEmotions = function (em) {
      return Algorithm.orderEmotions(
        em,
        $scope.config.circumplex.algorithmType,
        $scope.slideX,
        $scope.slideY
      );
    };
    //Sendemotion
    $scope.expressedEmotions = SharedEmotionsService.expressedEmotions;
    $scope.sendEmotion = function (name, click, index) {
      $scope.dewShowFeedback = true;
      $scope.dewShowInstructions = false;
      $scope.dewShowButtons = false;
      $scope.lastSendEmotion = new Date();
      $scope.otherEmotionInput = "";
      $scope.slideX.last = $scope.slideX.value;
      $scope.slideY.last = $scope.slideY.value;
      SharedEmotionsService.sendEmotion(
        $scope.user,
        name,
        $scope.slideX.value,
        $scope.slideY.value,
        click,
        index
      );
      $("#show-emotions-history").animate(
        {
          scrollLeft:
            $("#show-emotions-history").prop("scrollWidth") -
            $("#show-emotions-history").width() +
            160,
        },
        500
      );

      if ($scope.config.retrieving.showAppraisalSelf) {
        $scope.graph.lineChartSelf.addData(
          [$scope.slideX.value, $scope.slideY.value, 0],
          ""
        );
      }

      if ($scope.config.retrieving.showAppraisalOther) {
        $scope.graph.lineChartOther.addData(
          [$scope.slideX.lastOther, $scope.slideY.lastOther, 0],
          ""
        );
      }

      if ($scope.config.retrieving.showAppraisalX) {
        $scope.graph.lineChartDimX.addData(
          [$scope.slideX.value, $scope.slideX.lastOther, 0],
          ""
        );
      }

      if ($scope.config.retrieving.showAppraisalY) {
        $scope.graph.lineChartDimY.addData(
          [$scope.slideY.value, $scope.slideY.lastOther, 0],
          ""
        );
      }
      $("#other-emotion-field").val("");
    };
    //Filter my value
    $scope.isMine = function (user) {
      if (user == $scope.user) {
        return "mine";
      } else {
        return "other";
      }
    };
    //Graphs
    $scope.graph = {};
    $scope.initGraph = function (g) {
      _.extend($scope.graph, GraphService.initGraph(g));
    };
  }
);

app.service("Algorithm", function () {
  //Calculate
  this.calculateSlope = function (x, y) {
    var slope = Math.PI / 2 - Math.atan(y / x);
    if (x > 0 && y > 0) {
      slope = slope - 0.5 * Math.PI;
    } else if (x < 0 && y < 0) {
      slope = slope + 0.5 * Math.PI;
    } else if (x > 0 && y < 0) {
      slope = slope - 0.5 * Math.PI;
    } else if (x < 0 && y > 0) {
      slope = slope + 0.5 * Math.PI;
    }
    slope = (slope * 180) / Math.PI + 90;
    return slope;
  };
  //Order emotions in Subset
  this.orderEmotions = function (em, type, slideX, slideY) {
    if (type == "vector") {
      var aDistanceX = em.valueX - slideX.value;
      var aDistanceY = em.valueY - slideY.value;
      var aTotalDistance = Math.sqrt(
        Math.pow(aDistanceX, 2) + Math.pow(aDistanceY, 2)
      );
      return aTotalDistance;
    } else {
      //Angle
      var slope = this.calculateSlope(slideX.value, slideY.value);
      var diff_a = Math.abs(em.angle - slope);
      diff_a = diff_a > 180 ? 360 - diff_a : diff_a;
      return diff_a;
    }
  };
});

app.service("SharedEmotionsService", function () {
  this.expressedEmotions = [];
  this.sendEmotion = function (user, name, x, y, click, index) {
    this.expressedEmotions.push({
      user: user,
      feeling: name,
      createdAt: new Date(),
      x: x,
      y: y,
      click: click,
      index: index,
    });
  };
});

app.service("GraphService", function () {
  Chart.defaults.global.responsive = false;
  Chart.defaults.global.showScale = true;
  Chart.defaults.global.scaleShowLabels = true;
  Chart.defaults.global.showTooltips = false;
  Chart.defaults.global.scaleOverride = true;
  Chart.defaults.global.scaleStartValue = -100;
  Chart.defaults.global.scaleSteps = 4;
  Chart.defaults.global.scaleStepWidth = 50;
  Chart.defaults.global.animation = true;
  Chart.defaults.global.scaleFontSize = 10;
  this.initGraph = function (g) {
    var graphInitialData = {
      labels: [""],
      datasets: [
        {
          label: "Vous",
          fillColor: "rgba(15, 82, 190, 0)",
          strokeColor: "#428bca",
          pointColor: "rgba(0, 63, 126,1)",
          pointStrokeColor: "#fff",
          pointHighlightFill: "#fff",
          pointHighlightStroke: "rgba(220,220,220,1)",
          data: [0],
        },
        {
          label: "Collaborateur",
          fillColor: "rgba(151,187,205,0.0)",
          strokeColor: "#559300",
          pointColor: "rgba(197, 197, 197,1)",
          pointStrokeColor: "#fff",
          pointHighlightFill: "#fff",
          pointHighlightStroke: "rgba(151,187,205,1)",
          data: [0],
        },
        {
          label: "Baseline",
          fillColor: "rgba(151,187,205,0.0)",
          strokeColor: "#333",
          pointColor: "rgba(250, 250, 250,1)",
          pointStrokeColor: "#fff",
          pointHighlightFill: "#fff",
          pointHighlightStroke: "rgba(151,187,205,1)",
          data: [0],
        },
      ],
    };
    var graph = {};
    //Self
    if (g === "Self") {
      var ctxSelf = document.getElementById("self-graph").getContext("2d");
      graph.lineChartSelf = new Chart(ctxSelf).Line(graphInitialData, {
        bezierCurve: false,
        pointDot: false,
      });
    }
    //Other
    if (g === "Other") {
      var ctxOther = document.getElementById("other-graph").getContext("2d");
      graph.lineChartOther = new Chart(ctxOther).Line(graphInitialData, {
        bezierCurve: false,
        pointDot: false,
      });
    }
    //DimX
    if (g === "DimX") {
      var ctxDimX = document.getElementById("dimx-graph").getContext("2d");
      graph.lineChartDimX = new Chart(ctxDimX).Line(graphInitialData, {
        bezierCurve: false,
        pointDot: false,
      });
    }
    //DimY
    if (g === "DimY") {
      var ctxDimY = document.getElementById("dimy-graph").getContext("2d");
      graph.lineChartDimY = new Chart(ctxDimY).Line(graphInitialData, {
        bezierCurve: false,
        pointDot: false,
      });
    }
    return graph;
  };
});
