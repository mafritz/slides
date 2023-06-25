app.controller(
  "configuratorCtrl",
  function ($scope, $location, SharedEmotionsService, Algorithm) {
    //Blank slate
    $scope.$parent.config = {
      id: "gv6n5h6rmvbtvs4i",
      user: "695hkknh4rcqh0k9",
      createdAt: "Wed Sep 30 2015 14:48:36 GMT+0200",
      updatedAt: "Wed Sep 30 2015 14:48:36 GMT+0200",
      settings: {
        lang: "Français",
        name: "EATMINT circumplex (Fritz & Bétrancourt, 2017)",
        description:
          "Circumplex used in the development and test of the DEW first version",
        body: "Lorem ipsum...",
        isPublic: true,
        isOpen: false,
        isDemo: true,
      },
      circumplex: {
        algorithmType: "radial",
        dimX: "Valence",
        dimY: "Control",
        isGrid: false,
        emotions: [
          {
            name: "Confident",
            angle: 9,
          },
          {
            name: "Interested",
            angle: 27,
          },
          {
            name: "Amused",
            angle: 45,
          },
          {
            name: "Delighted",
            angle: 63,
          },
          {
            name: "Attentive",
            angle: 81,
          },
          {
            name: "Satisfied",
            angle: 99,
          },
          {
            name: "Relaxed",
            angle: 117,
          },
          {
            name: "Surprised",
            angle: 135,
          },
          {
            name: "Relieved",
            angle: 153,
          },
          {
            name: "Empathetic",
            angle: 171,
          },
          {
            name: "Confused",
            angle: 189,
          },
          {
            name: "Anxious",
            angle: 207,
          },
          {
            name: "Bored",
            angle: 225,
          },
          {
            name: "Stressed",
            angle: 243,
          },
          {
            name: "Disappointed",
            angle: 261,
          },
          {
            name: "Frustrated",
            angle: 279,
          },
          {
            name: "Envious",
            angle: 315,
          },
          {
            name: "Disgusted",
            angle: 297,
          },
          {
            name: "Annoyed",
            angle: 333,
          },
          {
            name: "Irritated",
            angle: 351,
          },
        ],
      },
      inserting: {
        questionX: "Is the situation pleasant?",
        dimXneg: "Not at all",
        dimXpos: "Yes, absolutely",
        questionY: "Is the situation under your control?",
        dimYneg: "Not at all",
        dimYpos: "Yes, absolutely",
        numSubset: 3,
        showOtherEmotion: true,
        showNoEmotion: true,
      },
      retrieving: {
        showTimeline: false,
        showTimelineSelf: true,
        showTimelineOther: true,
        showAppraisalSelf: false,
        showAppraisalOther: false,
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
      $scope.$parent.config = angular.copy(current);
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
