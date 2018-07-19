var Letter = require('Letter.js');

module.export = function Word(word,clue){
    this.clue = clue;
    this.guessed = false;
    for (var i=1;i<=word.length;i++) {
        this[toString(i)] = new Letter(word.charAt(i));
    }
    this.wasGuessed = function () {
        this.guessed = true;
    }
}