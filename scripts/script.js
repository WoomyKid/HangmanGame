const hangmanImage = document.querySelector(".hangman-box img");
const wordDisplay = document.querySelector(".word-display");
const guessesText = document.querySelector(".guesses b");
const keyboardDiv = document.querySelector(".keyboard");
const gameModal = document.querySelector(".game-modal");
const playAgainBtn = document.querySelector(".play-again");

let currentWord, correctLetters, wrongGuessCount, imgNum;
const maxGuesses = 6;

window.addEventListener('load', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode');
    if (mode) {
        document.getElementById('gamemode').value = mode;
    }
});

const resetGame = () => {
    correctLetters = [];
    wrongGuessCount = 0;
    imgNum = 5;
    hangmanImage.src = `images/hangman${imgNum}.png`;
    guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`;
    keyboardDiv.querySelectorAll("button").forEach(btn => btn.disabled = false);
    wordDisplay.innerHTML = currentWord.split("").map(() => `<li class="letter"></li>`).join("");
    gameModal.classList.remove("show");
}

const getRandomWord = () => {
    const {word, hint} = wordList[Math.floor(Math.random() * wordList.length)];
    currentWord = word;
    document.querySelector(".hint-text b").innerText = hint;
    resetGame();
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

const initgame = (button, clickedLetter) => {
    if(currentWord.includes(clickedLetter)) {
        [...currentWord].forEach((letter, index) => {
            if(letter === clickedLetter) {
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

    if(wrongGuessCount === maxGuesses) return gameOver(false);
    if(correctLetters.length === currentWord.length) return gameOver(true);
}

for (let i = 97; i <= 122; i++) {
    const button = document.createElement("button");
    button.innerText = String.fromCharCode(i);
    keyboardDiv.appendChild(button);
    button.addEventListener("click", e => initgame(e.target, String.fromCharCode(i)));
}

getRandomWord();
playAgainBtn.addEventListener("click", getRandomWord);

document.getElementById('gamemode').addEventListener('change', function() {
    const selectedOption = this.value;
    if (selectedOption === 'SOLO') {
        window.location.href = 'index.html';
    } else if (selectedOption === 'CUSTOM') {
        window.location.href = 'custom.html';
    }
});

document.getElementById('gamemode').addEventListener('change', function() {
    const selectedOption = this.value;
    if (selectedOption === 'SOLO') {
        window.location.href = 'index.html?mode=SOLO';
    } else if (selectedOption === 'CUSTOM') {
        window.location.href = 'custom.html?mode=CUSTOM';
    }
});