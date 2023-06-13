app.controller(
  "configuratorCtrl",
  function ($scope, $location, SharedEmotionsService, Algorithm) {
    //Blank slate
    $scope.$parent.config = {
      id: "",
      user: "695hkknh4rcqh0k9",
      createdAt: new Date(),
      updatedAt: new Date(),
      settings: {
        lang: "English",
        name: "The name of your configuration",
        description: "Short description of the configuration.",
        body: "Full description (with references etc.)",
        isDemo: false,
      },
      circumplex: {
        algorithmType: "radial",
        dimX: "Dimension X",
        dimY: "Dimension Y",
        isGrid: false,
        emotions: [
          {
            name: "Sample",
            angle: 9,
            valueX: 35,
            valueY: -25,
          },
          {
            name: "Sample 2",
            angle: 27,
            valueX: -67,
            valueY: 44,
          },
        ],
      },
      inserting: {
        questionX: "Label for Question X?",
        dimXneg: "Min. X",
        dimXpos: "Max. X",
        questionY: "Label for question Y?",
        dimYneg: "Min. Y",
        dimYpos: "Max. Y",
        numSubset: 3,
        showOtherEmotion: true,
        showNoEmotion: true,
      },
      retrieving: {
        showTimeline: true,
        showTimelineSelf: true,
        showTimelineOther: true,
        showAppraisalSelf: true,
        showAppraisalOther: true,
        showAppraisalX: false,
        showAppraisalY: false,
      },
      experiment: {
        isOpen: false,
        numUsers: 1,
        taskUrl:
          "https://drive.google.com/open?id=1KFWnimFR3iuGHM8-_Ju0b7mqSQbDjYPHvwTPyy0thL8",
        timer: 0,
        isSimulation: false,
        simulation: [],
      },
    };
    //Compare circumplexes
    $scope.compareCircumplexes = function (listed) {
      var scope = angular.toJson(
        _.omit($scope.$parent.config.circumplex, "$$hashKey")
      );
      var listed = angular.toJson(listed);
      return scope == listed;
    };
    //Update Circumplex
    $scope.updateCircumplex = function (id) {
      var current = _.findWhere($scope.circumplexes, { id: id });
      $scope.$parent.config.circumplex = angular.copy(current.circumplex);
      $("#existingCircumplexesModal").modal("hide");
    };
    //Remove emotion
    $scope.removeEmotionFromList = function (index) {
      $scope.$parent.config.circumplex.emotions.splice(index, 1);
    };
    //Remove simulation
    $scope.removeItemFromSimulation = function (index) {
      $scope.config.experiment.simulation.splice(index, 1);
    };
    //Save
    $scope.saving = false;
    $scope.saveConfiguration = function () {
      $scope.saving = true;
    };

    //Angle
    $scope.getCurrentAngle = function () {
      var angle = Algorithm.calculateSlope(
        $scope.slideX.value,
        $scope.slideY.value
      );
      return angle;
    };
    //Distances
    $scope.getRadialDistance = function (angle) {
      if ($scope.slideX.value != 0 || $scope.slideY.value != 0) {
        var distance = Math.round(
          Math.abs(
            angle -
              Algorithm.calculateSlope($scope.slideX.value, $scope.slideY.value)
          )
        );
        distance = distance > 180 ? 360 - distance : distance;
        return distance + "°";
      } else {
        return "No angle at [0:0]";
      }
    };
    $scope.getVectorDistance = function (x, y) {
      var aDistanceX = x - $scope.slideX.value;
      var aDistanceY = y - $scope.slideY.value;
      return Math.round(
        Math.sqrt(Math.pow(aDistanceX, 2) + Math.pow(aDistanceY, 2))
      );
    };

    $scope.getRadialX = function (a) {
      var x = 500 + 400 * Math.cos((a * Math.PI) / 180);
      return x;
    };
    $scope.getRadialY = function (a) {
      var y = 500 + 400 * Math.sin((a * Math.PI) / 180);
      return y;
    };
    //Switch ID
    $scope.switchCircumplex = function () {
      $scope.$parent.config = _.findWhere($scope.circumplexes, {
        id: $scope.id,
      });
      //$scope.sortEmotions();
      $location.path("/" + $scope.id);
    };
    //Trasform graphics coordinates
    $scope.translateX = function (x) {
      var tx = (Number(x) + 100) * 5;
      return tx;
    };
    $scope.translateY = function (y) {
      var ty = (Number(y) * -1 + 100) * 5;
      return ty;
    };
    //Other simulation
    $scope.simulateOtherEmotion = function () {
      $scope.slideX.lastOther = Math.round(Math.random() * 200 - 100);
      $scope.slideY.lastOther = Math.round(Math.random() * 200 - 100);
      var randomEmotion =
        $scope.config.circumplex.emotions[
          Math.round(Math.random() * $scope.config.circumplex.emotions.length)
        ].name;
      if ($scope.config.retrieving.showAppraisalSelf) {
        $scope.graph.lineChartOther.addData(
          [$scope.slideX.lastOther, $scope.slideY.lastOther, 0],
          ""
        );
      }

      if ($scope.config.retrieving.showAppraisalOther) {
        $scope.graph.lineChartSelf.addData(
          [$scope.slideX.last, $scope.slideY.last, 0],
          ""
        );
      }

      if ($scope.config.retrieving.showAppraisalX) {
        $scope.graph.lineChartDimX.addData(
          [$scope.slideX.last, $scope.slideX.lastOther, 0],
          ""
        );
      }

      if ($scope.config.retrieving.showAppraisalY) {
        $scope.graph.lineChartDimY.addData(
          [$scope.slideY.last, $scope.slideY.lastOther, 0],
          ""
        );
      }

      SharedEmotionsService.sendEmotion(
        "other",
        randomEmotion,
        $scope.slideX.lastOther,
        $scope.slideY.lastOther,
        "simulation",
        null
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
    };
  }
);
