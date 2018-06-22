// list of const pointers
const deck = document.getElementById('deck');
const frag = document.createDocumentFragment();
const moves = document.getElementById('movesCount');
const timer = document.getElementById('timer');
const winModal = document.getElementById("winner");
const winMove = document.getElementById("winmovecount");
const winStar = document.getElementById("starcount");
const winTimeStamp = document.getElementById("timecount");
const reset_dom = document.querySelectorAll(".reset");
const star = document.querySelectorAll(".fa-star");
// list of default values
let cardBox = [];
let clickFlag = false;
let moveCount = 0;
let timeFlag = false;
let winTime = 0;
let seconds = 0;
let minutes = 0;
let hours = 0;
let clock;
let winPoint = 0;
let starCount = 3;
/*
 * Create a list that holds all of your cards
 */

 const cards = [
     'fa-diamond',
     'fa-paper-plane-o',
     'fa-anchor',
     'fa-bolt',
     'fa-cube',
     'fa-leaf',
     'fa-bicycle',
     'fa-bomb'
    ];
/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

 const cardset = cards.reduce(function(x,y){
     return x.concat([y,y]);
 }, []);
// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


shuffle(cardset).forEach(function createCard(card) {
    const createList = document.createElement('li');
    let innerCard = `<i class= 'fa ${card}' ></i>`;
    createList.className= "card";
    createList.innerHTML=innerCard;
    frag.appendChild(createList);
});

deck.appendChild(frag);


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */


//adding classes to the clicked card
function displayCard(card){
    card.classList.add('open','show');
}

// f(n) to count the number of moves
function moveCounter() {
    moveCount++;
    moves.innerText = moveCount;
    if(moveCount > 10 && moveCount <=20){
        starCount = 2;
        star[star.length - 1].classList.replace("fa-star","fa-star-o");
    }else if(moveCount > 20){
        starCount = 1;
        console.log(star[star.length]);
        star[star.length-2].classList.replace("fa-star", "fa-star-o");
    }

}

//f(n) in case of cards are matched
function cardMatchTrue(cardClass) {
    let cardToShow = document.querySelectorAll(`.${cardClass}`);
    for (let i = 0; i < 2; i++) {
        cardToShow[i].parentNode.classList.replace("open", "match");
    }
}

//f(n) in case of cards don't match
function cardMatchFalse() {
    let cardToHide = document.querySelectorAll('.open');
    clickFlag = true;
    setTimeout(() => {
        for (let i = 0; i < cardToHide.length; i++) {
            cardToHide[i].classList.remove("open", "show");
        }
        clickFlag = false;
    }, 1000);
}

//check if the clicked card matches
function cardMatch(cardId){
if(cardBox.length === 0){
cardBox.push(cardId);
} else if (cardBox[0] == cardId) {
moveCounter();
cardMatchTrue(cardId);
winPoint++;
if(winPoint >= 8){
clearTimeout(clock);
winTime = timer.innerText;
winner(moveCount,starCount,winTime);
}

}else{
    cardBox = [];
    moveCounter();
    cardMatchFalse();
}

}


//f(n) if player win the game

function winner(mc,sc,tc){

    winMove.textContent = mc;
    winStar.textContent = sc;
    winTimeStamp.textContent = tc;
    setTimeout(() => {
        winModal.classList.replace("hide", "visible");
    }, 1200);

}


/*
- timer
counter learned from https: //jsfiddle.net/Daniel_Hug/pvk6p/
*/
function displayTime(){

    seconds++;
if (seconds >= 60){
    seconds = 0;
    minutes++;
    if (minutes >= 60) {
        minutes = 0;
        hours++;
    }
}

if(minutes < 1)
{
    timer.textContent = `${seconds} s`;
}else if(hours < 1){
    timer.textContent = `${minutes} m ${seconds} s`;
}else {
    timer.textContent = `${hours} h ${minutes} m ${seconds} s`;
}

startTimer();

}

function startTimer(){
    clock = setTimeout(displayTime, 1000);
}

function timerStamp(){
 if(!timeFlag){
    timeFlag = true;
    startTimer();
 }
}


/*
*Reset the game
 - listen to click on reset
 - reset the counter
 - reset the timer
 - reset the cards
*/

function reset(){
    deck.innerHTML = "";
    cardBox = [];
    clickFlag = false;
    moveCount = 0;
    timeFlag = false;
    winTime = 0;
    clearTimeout(clock);
    seconds = 0;
    minutes = 0;
    hours = 0;
    clock;
    winPoint = 0;
    starCount = 3;
if(star.length>0){
    star.forEach(function(s){
        s.classList.replace("fa-star-o","fa-star");
    });
}
    moves.innerText = moveCount;
    timer.textContent = `${seconds} s`;

    winModal.classList.remove('visible');
    winModal.classList.add('hide');
    shuffle(cardset).forEach(function createCard(card) {
        const createList = document.createElement('li');
        let innerCard = `<i class= 'fa ${card}' ></i>`;
        createList.className = "card";
        createList.innerHTML = innerCard;
        frag.appendChild(createList);
    });

    deck.appendChild(frag);




}

reset_dom.forEach(function(res){
    res.addEventListener('click',reset);
});






// event listerner to card click
deck.addEventListener('click',function(evt) {
    if(evt.target.className=="card" && clickFlag == false){
        displayCard(evt.target);
        cardMatch(evt.target.firstElementChild.classList[1]);
        timerStamp();
    }
});

