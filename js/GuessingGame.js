function Game() {
    this.playersGuess = null;
    this.pastGuesses = [];
    this.winningNumber = generateWinningNumber();
}

function generateWinningNumber() {
    return Math.floor(Math.random()*100) + 1;
}

function shuffle(arr) {
    var backIndex = arr.length;
    var backNum;
    var frontIndex;

    while(backIndex) {
        frontIndex = Math.floor(Math.random() * backIndex--);
        backNum = arr[backIndex];
        arr[backIndex] = arr[frontIndex];
        arr[frontIndex] = backNum;
    }
    return arr;
}


Game.prototype.playersGuessSubmission = function(num) {
    if (num < 1 || num > 100 || isNaN(num)) {
        throw "That is an invalid guess.";
    }
    this.playersGuess = num;

    return this.checkGuess();
}

Game.prototype.checkGuess = function() {
    if(this.playersGuess===this.winningNumber) {
        $('#hint, #submit').prop("disabled",true);
        $('#subtitle').text("Press the Reset button to play again!")
        return 'You Win!'
    }
    else {
        if(this.pastGuesses.indexOf(this.playersGuess) > -1) {
            return 'You have already guessed that number.';
        }
        else {
            this.pastGuesses.push(this.playersGuess);
            $('#guess-list li:nth-child('+ this.pastGuesses.length +')').text(this.playersGuess);
            if(this.pastGuesses.length === 5) {
                $('#hint, #submit').prop("disabled",true);
                $('#subtitle').text("Press the Reset button to play again!")
                return 'You Lose.';
            }
            else {
                var diff = this.difference();
                if(this.isLower()) {
                    $('#subtitle').text("Guess Higher!")
                } else {
                    $('#subtitle').text("Guess Lower!")
                }
                if(diff < 10) return'You\'re burning up!';
                else if(diff < 25) return'You\'re lukewarm.';
                else if(diff < 50) return'You\'re a bit chilly.';
                else return'You\'re ice cold!';
            }
        }
    }
}


Game.prototype.difference = function() {
    return Math.abs(this.playersGuess - this.winningNumber);
}

Game.prototype.isLower = function() {
    if (this.playersGuess < this.winningNumber) {
        return true;
    } 
    return false;
}

Game.prototype.provideHint = function()  {
    var arr = [];
    arr.push(this.winningNumber, generateWinningNumber(), generateWinningNumber());
    
    return shuffle(arr);
}

function newGame() {
    var game = new Game();
    return game;
}

function guessFunc(game) {
    var guess = $("#player-input").val();
    $("#player-input").val("");
    $("#title").text(game.playersGuessSubmission(parseInt(guess, 10)));
}


function makeAGuess(game) {
    var guess = $('#player-input').val();
    $('#player-input').val("");
    var output = game.playersGuessSubmission(parseInt(guess,10));
    $('#title').text(output);
}


$(document).ready(function() {
    var game = new Game();

    $("#submit").click(function(e) {
        guessFunc(game);
    })

    $("#player-input").keypress(function(event) {
        if (event.which == 13) {
            guessFunc(game);
        }
    })

    $("#hint").click(function() {
        var hints = game.provideHint();
        $('#title').text('The winning number is '+hints[0]+', '+hints[1]+', or '+hints[2]);
    })

    $('#reset').click(function() {
        game = newGame();
        $('#title').text('Play the Guessing Game!');
        $('#subtitle').text('Guess a number between 1-100!')
        $('.guess').text('-');
        $('#hint, #submit').prop("disabled",false);

    })
})