// Shuffle array numbers
function cardsShuffle(array){
  let i = array.length;
  let j, temp;

  while (--i > 0) {
    j = Math.floor( Math.random() * (i + 1) );
    temp = array[j];
    array[j] = array[i];
    array[i] = temp;
  }

  return array;
}

// Fill card board
function fillCards(array) {
  let output = '';

  array.forEach( (card, index) => {
    cardHTML = `
      <div class="flip3D" data-value="${card}">
        <div class="backside" id="card_${index + 1}">${card}</div>
        <div class="frontside"></div>
      </div>
    `;

      output += cardHTML;
  });

  return output;
}

const numbersArray = Array.from(Array(9).keys());
const boardArray = numbersArray.concat(numbersArray).sort().slice(2, numbersArray.length * 2);

// Start program
document.addEventListener('DOMContentLoaded', () => {
  const newGameBtn = document.querySelector('#newGameBtn');
  const timerDisplay = document.querySelector('#timer');
  const gameInfo = document.querySelector('#gameInfo');
  const board = document.querySelector('#board');
  const openedCards = [];
  const frontCardsArray  = [];
  let flipedCards = 0;
  let cardsCountDown = 0;
  let timerCountdown;

  // Timer function
  function timer(seconds) {
    clearInterval(timerCountdown);

    const now = Date.now();
    const then = now + seconds * 1000;
    displayTimeLeft(seconds);

    timerCountdown = setInterval(() => {
      const secondsLeft = Math.round((then - Date.now()) / 1000);
      // check if we should stop it!
      if(secondsLeft < 0) {
        alert('Время кончилось!');
        clearInterval(timerCountdown);
        return;
      }
      // display it
      displayTimeLeft(secondsLeft);
    }, 1000);
  }

  // Timer display
  function displayTimeLeft(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainderSeconds = seconds % 60;
    const display = `${minutes}:${remainderSeconds < 10 ? '0' : '' }${remainderSeconds}`;
    timerDisplay.textContent = display;
  }

  // Compare cards
  function cardsCompare(card1, card2) {
    const backSide1 = card1;
    const backSide2 = card2;

    // If cards matched
    if (openedCards[0].value === openedCards[1].value &&
      openedCards[0].cardID !== openedCards[1].cardID) {
      backSide1.style.transition = "background .5s ease-in-out";
      backSide2.style.transition = "background .5s ease-in-out";
      backSide1.style.background = '#63ff68';
      backSide2.style.background = '#63ff68';

      backSide1.parentNode.removeEventListener('click', displayCards);
      backSide2.parentNode.removeEventListener('click', displayCards);

      cardsCountDown += 2;
      openedCards.length = 0;
      return;
    }
  }

  // Fliping cards
  function displayCards() {
    if (openedCards.length === 2 ) {
      cardBackside1 = document.querySelector(`#${openedCards[0].cardID}`);
      cardBackside2 = document.querySelector(`#${openedCards[1].cardID}`);
      cardFrontside1 = cardBackside1.parentNode.querySelector('.frontside');
      cardFrontside2 = cardBackside2.parentNode.querySelector('.frontside');

      cardBackside1.classList.remove('open');
      cardBackside2.classList.remove('open');
      cardFrontside1.classList.remove('open');
      cardFrontside2.classList.remove('open');

      openedCards.length = 0;
     }

    const frontSide = this.querySelector('.frontside');
    const backSide = this.querySelector('.backside');
    const value = this.dataset.value;
    const cardID = backSide.id;

    frontCardsArray.push(frontSide);

    // if opened two cards
    if (flipedCards === 1) {
      frontSide.classList.add('open');
      backSide.classList.add('open');
      flipedCards++;
      openedCards.push( {value, cardID} );

      const card1 = document.querySelector(`#${openedCards[0].cardID}`);
      const card2 = document.querySelector(`#${openedCards[1].cardID}`);
      cardsCompare(card1, card2);

      flipedCards = 0;
      frontCardsArray.length = 0;

      if(cardsCountDown == 16) {
        clearInterval(timerCountdown);
        setTimeout("alert('Наши поздравления, вы выиграли!!!')", 500);
        newGameBtn.classList.remove('display_none');
      }

      return;
    }

    // if opened one card
    if (flipedCards === 0) {
      frontSide.classList.add('open');
      backSide.classList.add('open');

      flipedCards++;
      openedCards.push( {value, cardID} );
    }
  }

  // Start New Game
  newGameBtn.addEventListener('click', () => {
    gameInfo.classList.add('display_none');
    board.classList.remove('display_none');
    newGameBtn.classList.add('display_none');
    newGameBtn.textContent = 'Сыграть ещё раз';
    cardsCountDown = 0;

    boardCardsArray = cardsShuffle(boardArray);
    document.querySelector('#memoryBoard').innerHTML = fillCards(boardCardsArray);
    document.querySelector('#timerSection').classList.remove('display_none');

    // Start timer
    timer(60);

    // Get all cards
    const flipingCards = document.querySelectorAll('.flip3D');
    flipingCards.forEach(card => card.addEventListener('click', displayCards));
  });
});
