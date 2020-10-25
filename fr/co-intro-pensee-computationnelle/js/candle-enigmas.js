var enigma1 = new Vue({
  el: "#enigma1",
  data: {
    piecesAvailable: 9,
    piecesRequired: 3,
    solution: "",
    cycle: 0,
    totalCandles: 0,
  },
  methods: {
    resolveFirstEnigma: function () {
      this.solution = "";
      this.cycle = 0;
      this.totalCandles = 0;
      var currentPieces = this.piecesAvailable;
      while (currentPieces / this.piecesRequired >= 1) {
        this.cycle++;
        this.solution += "#" + this.cycle + " Depuis ";
        if (this.cycle > 1) {
          this.solution += " ces ";
        }
        var piecesObtained = Math.floor(currentPieces / this.piecesRequired);
        this.solution +=
          currentPieces +
          " bouts, il reconstruit " +
          piecesObtained +
          " nouveau(x) cierge(s). En les brûlant, il recupère " +
          piecesObtained +
          " bout(s)\n";
        currentPieces = Math.floor(currentPieces / this.piecesRequired);
        this.totalCandles += currentPieces;
      }
      this.solution +=
        "#" +
        ++this.cycle +
        " Avec seulement " +
        currentPieces +
        " bout(s), il ne peut plus reconstruire un cierge";
    },
  },
});
