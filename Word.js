var Letter = require('./Letter.js');

module.exports = function Word (word,clue){
    this.clue = clue;
    this.displayed = false;
    this.guessed = null;
    this.chances = 10;
    this.word = word;
    this.incorrectLetters = [];
    this.letters = [];
    for (var i=0;i<word.length;i++) {
        this.letters.push(new Letter(word.charAt(i)));
    }

    this.generateToGuess = function () {
        var gen = "";
        this.letters.forEach(e => {
            if ([" ","-","\'"].includes(e.letter)) {
                gen += e.letter;
                e.guessed = true;
            } else if (![" ","-","\'"].includes(e.letter) && e.guessed === null) {
                gen += "_ ";
            } else {
                gen += e.letter + " ";
            }
        });
        
        return this.clue.concat("\n",gen);
    };

    this.guessWord = function (guess) {
        var lettersList = this.letters.map(function(letter) {return letter['letter'];});
        var guessedList = this.letters.map(function(letter) {return letter['guessed'];});
        var indexOfGuessedLetter = lettersList.indexOf(guess);
        if (!lettersList.includes(guess)) {
            if (!this.incorrectLetters.includes(guess)) {
                this.incorrectLetters.push(guess);
                this.chances--;
                console.log('INCORRECT!');
                if (this.chances > 0) console.log(this.chances + ' guesses remaining!');
            }
        } else {
            if (guessedList[indexOfGuessedLetter] != true) console.log('CORRECT!'); 
        }
        this.letters.forEach(e => {
            if(e.letter === guess) e.guessed = true;
        });
        return [this.chances===0, this.letters.find(e => {return e.guessed === null;}), this.generateToGuess()]
    };
}