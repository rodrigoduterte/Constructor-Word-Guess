var Word = require('./Word.js');
var unirest = require('unirest');
var inquirer = require('inquirer');
var Rx = require('rxjs');
var validator = require('validator');
var prompts = new Rx.Subject();

var numberOfWords = 5;
var keysToSelect = ['definition','synonyms','similarTo','antonyms'];

var Words = [];
var WordsIterator = Words[Symbol.iterator]();
var currentWord;

(function runGame() {
    function askForLetter() {
        return {
          type: 'input',
          name: `userInput`,
          message: 'Guess a letter? ',
          maxLength: 1,
          validate: function(input) {
              return validator.isAlpha(input) && validator.isLength(input,{min:1,max:1});
          }
        };
    }
    for (var i = 1; i <= (numberOfWords > 30 ? 30 : numberOfWords); i++) {
        unirest.get("https://wordsapiv1.p.mashape.com/words/?random=true")
        .header("X-Mashape-Key", "SbvuiOsakNmsh5ZiGyhdXp96cER4p1KYzkTjsnxa1WFD3ZuM6Y")
        .header("X-Mashape-Host", "wordsapiv1.p.mashape.com")
        .end(function (result) {
            if (result.body.results) {
                Words.push(new Word(result.body.word,result.body.results[0].definition));
            } else {
                Words.push(new Word(result.body.word,""));
            }
            if (numberOfWords === Words.length) {
                function iterateWords() {
                    currentWord = WordsIterator.next();
                    console.log(currentWord.value.generateToGuess());
                    prompts.next(askForLetter()); 
                };
                iterateWords();

                inquirer.prompt(prompts).ui.process.subscribe(({ answer }) => {
                    if (currentWord.done === true) {
                        console.log('Interactive session is complete. Good bye! 👋\n');
                        prompts.complete();
                    } else {
                        guessWord = currentWord.value.guessWord(answer);
                        if(guessWord[0]) {
                            console.log('Sorry you missed the answer!');
                            iterateWords();
                        } else if (!guessWord[0]) {
                            if (guessWord[1]) { //////// if guessWord[1] returns an object OR if there are unguessed letters
                                console.log(guessWord[2]);
                                prompts.next(askForLetter());
                            } else { ///////////// if guessWord[1] returns undefined OR if all letters are guessed
                                console.log(guessWord[2]);
                                console.log('You got it right! Next Word!');
                                iterateWords();
                            }
                        }
                    }
                }, (err) => {
                    console.warn(err);
                });
                prompts.next(askForLetter());  
			}
		});
    }
}());