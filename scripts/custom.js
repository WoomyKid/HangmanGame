const hangmanImage = document.querySelector(".hangman-box img");
const wordDisplay = document.querySelector(".word-display");
const guessesText = document.querySelector(".guesses b");
const keyboardDiv = document.querySelector(".keyboard");
const gameModal = document.querySelector(".game-modal");
const playAgainBtn = document.querySelector(".play-again");
const customGame = document.querySelector(".custom");
const input = document.getElementById("input");

let currentWord, correctLetters, wrongGuessCount, imgNum, displayWord;
const maxGuesses = 10;

window.addEventListener("load", function() {
    const urlParams = new URLSearchParams(window.location.search);
            const mode = urlParams.get('mode');
            if (mode) {
                document.getElementById('gamemode').value = mode;
            }
    customGame.classList.add("show");
});

document.querySelector(".start").addEventListener("click", function() {
    if (input.value.trim() === "") {
        alert("Enter prompt first.");
        return;
    }
    
    getRandomWord();
    customGame.classList.remove("show");
});

const getRandomWord = () => {
    const word = input.value.trim();
    currentWord = word;
    resetGame();
}

const resetGame = () => {
    correctLetters = [];
    wrongGuessCount = 0;
    imgNum = 1;
    hangmanImage.src = `images/hangman${imgNum}.png`;
    guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`;
    keyboardDiv.querySelectorAll("button").forEach(btn => btn.disabled = false);

    // Create displayWord and mark non-letters as guessed
    displayWord = currentWord.split("").map(letter => {
        if (!/^[a-zA-Z]$/.test(letter)) {
            correctLetters.push(letter); // Mark non-letters as already guessed
            return `<li class="letter guessed">${letter}</li>`;
        } else {
            return `<li class="letter"></li>`;
        }
    }).join("");
    wordDisplay.innerHTML = displayWord;

    gameModal.classList.remove("show");
}

const gameOver = (victory) => {
    setTimeout(() => {
        const modalText = victory ? `You found the word:` : `The correct word was:`;
        gameModal.querySelector("img").src = `images/${victory ? 'victory' : 'lost'}.gif`;
        gameModal.querySelector("h4").innerText = `${victory ? 'You got it!' : 'Game Over!'}`;
        gameModal.querySelector("p").innerHTML = `${modalText} <b>${currentWord}</b>`;
        gameModal.classList.add("show");
    }, 300)
}

const initGame = (button, clickedLetter) => {
    if (currentWord.includes(clickedLetter)) {
        [...currentWord].forEach((letter, index) => {
            if (letter === clickedLetter) {
                correctLetters.push(letter);
                wordDisplay.querySelectorAll("li")[index].innerText = letter;
                wordDisplay.querySelectorAll("li")[index].classList.add("guessed");
            }
        });
    } else {
        imgNum++;
        wrongGuessCount++;
        hangmanImage.src = `images/hangman${imgNum}.png`;
    }
    button.disabled = true;
    guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`;

    // Calculate the number of guessed letters correctly
    const lettersGuessed = wordDisplay.querySelectorAll("li.guessed").length;
    const totalLetters = currentWord.split("").filter(letter => /^[a-zA-Z]$/.test(letter)).length;

    if (wrongGuessCount === maxGuesses) return gameOver(false);
    if (lettersGuessed === totalLetters + correctLetters.filter(l => !/^[a-zA-Z]$/.test(l)).length) return gameOver(true);
}

// Create keyboard buttons
for (let i = 97; i <= 122; i++) {
    const button = document.createElement("button");
    button.innerText = String.fromCharCode(i);
    keyboardDiv.appendChild(button);
    button.addEventListener("click", e => initGame(e.target, String.fromCharCode(i)));
}

playAgainBtn.addEventListener("click", function() {
    input.value = "";
    customGame.classList.add("show");
    gameModal.classList.remove("show");
    keyboardDiv.querySelectorAll("button").forEach(btn => btn.disabled = false);
});

document.getElementById('gamemode').addEventListener('change', function() {
    const selectedOption = this.value;
    if (selectedOption === 'SOLO') {
        window.location.href = 'index.html?mode=SOLO';
    } else if (selectedOption === 'CUSTOM') {
        window.location.href = 'custom.html?mode=CUSTOM';
    }
});