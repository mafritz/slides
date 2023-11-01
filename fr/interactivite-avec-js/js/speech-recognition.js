// JavaScript
var recognition = new (window.SpeechRecognition ||
  window.webkitSpeechRecognition ||
  window.mozSpeechRecognition ||
  window.msSpeechRecognition)();
recognition.lang = "en";
recognition.interimResults = false;
recognition.maxAlternatives = 1;

recognition.addEventListener("start", function () {
  document.getElementById("message").textContent = "I am listening..."; // replace with your 'listening' icon
  document.getElementById("output").textContent = "";
});

recognition.addEventListener("end", function () {
  document.getElementById("message").textContent = "Say the color out loud"; // replace with your original icon
});

document.getElementById("startButton").addEventListener("click", function () {
  recognition.start();
});

// JavaScript
var colors = ["red", "blue", "green", "orange", "purple"]; // replace with your colors

recognition.addEventListener("result", function (event) {
  var transcript = event.results[0][0].transcript.toLowerCase();
  transcript = transcript.replace(/\.$/, ""); // strip the period at the end
  var words = transcript.split(" ");
  var outputText = words.join(" ");

  // check if the spoken word is a color
  var colorWord = words.find((word) => colors.includes(word));
  if (colorWord) {
    // change the color of the text to the spoken color
    document.getElementById("output").textContent = outputText;
    document.getElementById("output").style.color = colorWord;
  } else {
    document.getElementById("output").textContent =
      "Sorry, I did not recognize any of these colors!";
    document.getElementById("output").style.color = "black";
  }
});
