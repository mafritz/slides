function letterToDecimalToBinary() {
  let powerOfTwoContainer = document.getElementById("power-of-two-container");
  let equivalencePlaceholder = document.getElementById(
    "letterToNumberEquivalence"
  );

  powerOfTwoContainer.innerHTML = "";

  function generateRandomLetter() {
    return String.fromCharCode(97 + Math.floor(Math.random() * 26));
  }

  let randomLetter = generateRandomLetter();
  let letterToDecimal = randomLetter.charCodeAt(0);
  let letterToBinary = letterToDecimal.toString(2);

  equivalencePlaceholder.innerHTML = `${randomLetter} <i class="fas fa-equals"></i> ${letterToDecimal} <i class="fas fa-equals"></i> ${letterToBinary}`;

  let powerOfTwo = [];
  for (let i = letterToBinary.length - 1; i >= 0; i--) {
    powerOfTwo.push(Math.pow(2, i));
  }

  for (let i = letterToBinary.length - 1; i >= 0; i--) {
    if (Number(letterToBinary[6 - i])) {
      powerOfTwoContainer.innerHTML += `<div>
    <div
              class="border border-dark-1 p-1 text-center  bg-danger text-white"
              style="width: 50px"
            >
              ${Math.pow(2, i)}
            </div>
            <div class="mt-1">${letterToBinary[6 - i]}</div>
            </div>`;
    } else {
      powerOfTwoContainer.innerHTML += `<div>
    <div
              class="border border-dark-1 p-1 text-center"
              style="width: 50px"
            >
              ${Math.pow(2, i)}
            </div>
            <div class="mt-1">${letterToBinary[6 - i]}</div>
            </div>`;
    }
  }
}

// Play one time
letterToDecimalToBinary();
