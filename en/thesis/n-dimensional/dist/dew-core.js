var DEW = (() => {
  var __defProp = Object.defineProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, {get: all[name], enumerable: true});
  };

  // src/index.ts
  var src_exports = {};
  __export(src_exports, {
    computeMultiDimensionalDistance: () => computeMultiDimensionalDistance,
    computeSlope: () => computeSlope,
    computeUniDimensionalDistance: () => computeUniDimensionalDistance,
    getRadialCoordinates: () => getRadialCoordinates,
    getRandomNumber: () => getRandomNumber,
    shuffleArray: () => shuffleArray,
    simulateVectorAffectiveSpace: () => simulateVectorAffectiveSpace,
    sortAffectiveSpace: () => sortAffectiveSpace,
    sortByRadialDistance: () => sortByRadialDistance,
    sortByRandomOrder: () => sortByRandomOrder,
    sortByVectorDistance: () => sortByVectorDistance,
    subsetFeelings: () => subsetFeelings
  });

  // src/computeSlope.ts
  var computeSlope = function(x, y) {
    let slope = Math.PI / 2 - Math.atan(y / x);
    if (x > 0 && y > 0) {
      slope = slope - 0.5 * Math.PI;
    } else if (x < 0 && y < 0) {
      slope = slope + 0.5 * Math.PI;
    } else if (x > 0 && y < 0) {
      slope = slope - 0.5 * Math.PI;
    } else if (x < 0 && y > 0) {
      slope = slope + 0.5 * Math.PI;
    } else {
      slope = 0;
    }
    slope = slope * 180 / Math.PI + 90;
    return slope;
  };

  // src/getRadialCoordinates.ts
  var getRadialCoordinates = function(affectiveSpace, center, radius) {
    function getRadialX(angle) {
      let x = center + radius * Math.cos(angle * Math.PI / 180);
      return x;
    }
    function getRadialY(angle) {
      let y = center + radius * Math.sin(angle * Math.PI / 180);
      return y;
    }
    let copyOfAffectiveSpace = JSON.parse(JSON.stringify(affectiveSpace));
    return copyOfAffectiveSpace.feelings.map(function(feeling) {
      let currentAngle = feeling.angle;
      feeling.coordinates = [];
      feeling.coordinates[0] = getRadialX(currentAngle);
      feeling.coordinates[1] = getRadialY(currentAngle);
      return feeling;
    });
  };

  // src/getRandomNumber.ts
  var getRandomNumber = function(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  };

  // src/shuffleArray.ts
  var shuffleArray = function(array) {
    let currentIndex = array.length;
    let temporaryValue, randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  };

  // src/sortByRadialDistance.ts
  var sortByRadialDistance = function(feelings, x, y) {
    let currentSlope = computeSlope(x, y);
    function orderByAngle(firstFeeling, secondFeeling) {
      let firstFeelingAngle = firstFeeling.angle;
      let secondFeelingAngle = secondFeeling.angle;
      return Math.abs(firstFeelingAngle - currentSlope) - Math.abs(secondFeelingAngle - currentSlope);
    }
    feelings.sort(orderByAngle);
    return feelings;
  };

  // src/computeUniDimensionalDistance.ts
  var computeUniDimensionalDistance = function(firstArray, secondArray) {
    return Math.abs(firstArray[0] - secondArray[0]);
  };

  // src/computeMultiDimensionalDistance.ts
  var computeMultiDimensionalDistance = function(firstArray, secondArray) {
    let multiDimensionalDistance = 0;
    for (let i = 0; i < firstArray.length; i++) {
      multiDimensionalDistance += Math.pow(firstArray[i] - secondArray[i], 2);
    }
    multiDimensionalDistance = Math.sqrt(multiDimensionalDistance);
    return multiDimensionalDistance;
  };

  // src/sortByVectorDistance.ts
  var sortByVectorDistance = function(feelings, appraisals) {
    function sortByOneDimension(firstFeeling, secondFeeling) {
      let deltaFirstFeeling = computeUniDimensionalDistance(firstFeeling.coordinates, appraisals);
      let deltaSecondFeeling = computeUniDimensionalDistance(secondFeeling.coordinates, appraisals);
      if (deltaFirstFeeling > deltaSecondFeeling) {
        return 1;
      } else if (deltaFirstFeeling < deltaSecondFeeling) {
        return -1;
      } else {
        return 0;
      }
    }
    function sortByMultiDimensions(firstFeeling, secondFeeling) {
      let distanceFirstFeeling = computeMultiDimensionalDistance(appraisals, firstFeeling.coordinates);
      let distanceSecondFeeling = computeMultiDimensionalDistance(appraisals, secondFeeling.coordinates);
      if (distanceFirstFeeling > distanceSecondFeeling) {
        return 1;
      } else if (distanceFirstFeeling < distanceSecondFeeling) {
        return -1;
      } else {
        return 0;
      }
    }
    let numAppraisals = appraisals.length;
    if (numAppraisals === 1) {
      feelings.sort(sortByOneDimension);
    } else if (numAppraisals > 1) {
      feelings.sort(sortByMultiDimensions);
    } else {
      console.log("The number of appraisals is not valid");
    }
    return feelings;
  };

  // src/sortByRandomOrder.ts
  var sortByRandomOrder = function(feelings) {
    return shuffleArray(feelings);
  };

  // src/sortAffectiveSpace.ts
  var sortAffectiveSpace = function(space, appraisals) {
    let copyOfAffectiveSpace = JSON.parse(JSON.stringify(space));
    let copyOfFeelings = copyOfAffectiveSpace.feelings;
    let sortedFeelings = [];
    if (space.algorithmType.toLocaleLowerCase() === "radial") {
      if (appraisals[0] === 0 && appraisals[1] === 0) {
        appraisals[0] = getRandomNumber(-100, 100);
        appraisals[1] = getRandomNumber(-100, 100);
      }
      sortedFeelings = sortByRadialDistance(copyOfFeelings, appraisals[0], appraisals[1]);
    } else if (space.algorithmType.toLocaleLowerCase() === "vector") {
      sortedFeelings = sortByVectorDistance(copyOfFeelings, appraisals);
    } else if (space.algorithmType.toLocaleLowerCase() === "random") {
      sortedFeelings = sortByRandomOrder(copyOfFeelings);
    } else {
      console.log("Provide a valid algorithm type.");
    }
    return sortedFeelings;
  };

  // src/subsetFeelings.ts
  var subsetFeelings = function(feelings, cardinality) {
    let subset = feelings.slice(0, cardinality);
    return subset;
  };

  // src/simulateVectorAffectiveSpace.ts
  function simulateVectorAffectiveSpace(numEmotions, numAppraisals) {
    let feelings = [];
    for (let i = 0; i < numEmotions; i++) {
      let randomCoordinates = [];
      for (let j = 0; j < numAppraisals; j++) {
        randomCoordinates.push(getRandomNumber(-100, 100));
      }
      feelings.push({
        label: "Feeling #".concat(String(i + 1)),
        coordinates: randomCoordinates
      });
    }
    return {
      algorithmType: "vector",
      feelings
    };
  }
  return src_exports;
})();
