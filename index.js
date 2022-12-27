const cardObjectDefinitions = [
    {id:1, imagePath:'./images/card-KingHearts.png'},
    {id:2, imagePath:'./images/card-JackClubs.png'},
    {id:3, imagePath:'./images/card-QueenDiamonds.png'},
    {id:4, imagePath:'./images/card-AceSpades.png'}
]

const aceId = 4;

const cardBackImgPath = './images/card-back-Blue.png';

let cards = [];

let cardPositions = [];

let gameInProgress = false;
let shufflingInprogress = false; 
let cardsRevealed = false;

const currentGameStatusElem = document.querySelector('.current-status');
const scoreContainerElem = document.querySelector('.header-score-container');
const scoreElem = document.querySelector('.score');
const roundContainerElem = document.querySelector('.header-round-conatiner');
const roundElem = document.querySelector('.round');

const winColor = "green";
const looseColor = "red";
const primaryColor = "black";

let roundNum = 1;
let maxRounds = 4;
let score = 0;


const playGameButtonElem = document.getElementById('playGame');

const collapsedGridAreaTemplate = '"a a" "a a"';
const cardCollectionCellClass = ".card-pos-a";

const numCards = cardObjectDefinitions.length;

const cardContainerElem = document.querySelector('.card-container');

{/*
    <div class="card">
        <div class="card-inner">
            <div class="card-front">
                <img src="./images/card-JackClubs.png" alt="" class="card-img">
            </div>
            <div class="card-back">
                <img src="./images/card-back-Blue.png" alt="" class="card-img">
            </div>
        </div>
    </div>
*/ }

loadGame();

function gameOver(){
    updateStatusElement(scoreContainerElem,"none");
    updateStatusElement(roundContainerElem,"none");

    const gameOverMessage = `Game Over! Final Score - <span class='badge'>${score}</span>
                             Click Play Game button to play again`

    updateStatusElement(currentGameStatusElem,"block",primaryColor,gameOverMessage);
    gameInProgress = false;
    playGameButtonElem.disabled = false;
}

function endRound(){
    setTimeout(()=>{
        if(roundNum == maxRounds){
            gameOver();
            return
        }
        else{
            startRound();
        }
    },3000);
}

function chooseCard(card){
    if(canChooseCard()){
        evaluateCardChoice(card);
        flipCard(card,false)

        setTimeout(()=>{
            flipCards(false)
            updateStatusElement(currentGameStatusElem,"block",primaryColor,"Card Positions Revealed");
            endRound();
        },3000);
        cardsRevealed = true;
    }
}

function calculateScoreToAdd(roundNum){
    if(roundNum == 1){
        return 100;
    }
    else if(roundNum == 2){
        return 50;
    }
    else if(roundNum == 3){
        return 25;
    }
    else{
        return 10;
    }
}

function calculateScore(){
    const scoreToAdd = calculateScoreToAdd(roundNum);
    score += scoreToAdd;
}

function updateScore(){
    calculateScore();
    updateStatusElement(scoreElem, "block", primaryColor, `Score <span class='badge'>${score}</span>`)
}

function updateStatusElement(elem,display,color,innerHTML){
    if(elem!=null){
        elem.style.display = display;
    }
    
    if(arguments.length > 2){
        elem.style.color = color;
        elem.innerHTML = innerHTML;
    }
}

function outputChoiceFeedBack(hit){
    if(hit){
        updateStatusElement(currentGameStatusElem, "block", winColor, "Hit!! - Well Done!! :)");
    }
    else{
        updateStatusElement(currentGameStatusElem, "block", looseColor, "Missed!! :(");
    }
}

function evaluateCardChoice(card){
    if(card.id == aceId){
        updateScore();
        outputChoiceFeedBack(true);
    }
    else{
        outputChoiceFeedBack(false);
    }
}

function canChooseCard(){
    return gameInProgress == true && !shufflingInprogress &&!cardsRevealed;
}

function loadGame(){
    createCards();

    cards = document.querySelectorAll('.card');

    playGameButtonElem.addEventListener('click', () => startGame());

    updateStatusElement(scoreElem,"none");
    updateStatusElement(roundElem,"none");
}

function startGame(){
    initializeNewGame();
    startRound();
}

function initializeNewGame(){
    score = 0;
    roundNum = 0;

    shufflingInprogress = false;

    updateStatusElement(scoreContainerElem,"flex")
    updateStatusElement(roundContainerElem,"flex")

    updateStatusElement(scoreElem,"block",primaryColor,`Score <span class='badge'>${score}</span>`);
    updateStatusElement(roundElem,"block",primaryColor,`Round <span class='badge'>${roundNum}</span>`);
}

function startRound(){
    initializeNewRound();
    collectCards();
    flipCards(true);
    shuffleCards()
}

function initializeNewRound(){
    roundNum++;
    playGameButtonElem.disabled = true;

    gameInProgress = true;
    shufflingInprogress = true;
    cardsRevealed = false;

    updateStatusElement(currentGameStatusElem, "block", primaryColor,"Shuffling...");

    updateStatusElement(roundElem, "block", primaryColor,`Round <span class='badge'>${roundNum}</span>`);

}

function collectCards(){
    transformGridArea(collapsedGridAreaTemplate);
    addCardsToGridAreaCell(cardCollectionCellClass);
}

function transformGridArea(areas){
    cardContainerElem.style.gridTemplateAreas = areas;
}

function addCardsToGridAreaCell(cellPositionClassName){
    const cellPositionElem = document.querySelector(cellPositionClassName);

    cards.forEach((card,index) => {
        addChildElement(cellPositionElem, card);
    })
}

function flipCard(card, flipToBack){
    const innerCardElem = card.firstChild;

    if(flipToBack && !innerCardElem.classList.contains('flip-it')){
        innerCardElem.classList.add('flip-it');
    }
    else if(innerCardElem.classList.contains('flip-it')){
        innerCardElem.classList.remove('flip-it');
    }
}

function flipCards(flipToBack){
    cards.forEach((card,index)=>
    {
        setTimeout(()=>{
            flipCard(card,flipToBack)
        },index*100);
    });
}

function shuffleCards(){
    const id = setInterval(shuffle,12);
    let shuffleCount = 0;
    function shuffle(){

        randomizeCardPositions();

        if(shuffleCount == 500){
            clearInterval(id);
            shufflingInprogress = false;
            dealCards();
            updateStatusElement(currentGameStatusElem,"block",primaryColor,"Please choose a card you think is a Ace of Spade");
        }
        else{
            shuffleCount++;
        }
    }
}

function randomizeCardPositions(){
    const random1 = Math.floor(Math.random() * numCards) + 1;
    const random2 = Math.floor(Math.random() * numCards) + 1;

    const temp = cardPositions[random1 - 1];
    cardPositions[random1 - 1] = cardPositions[random2 - 1];
    cardPositions[random2 - 1] = temp;
}

function dealCards(){
    addCardsToAppropriateCell();
    const areasTemplate = returnGridAreasMappedToCardPos();

    transformGridArea(areasTemplate);
}

function returnGridAreasMappedToCardPos(){
    let firstPart = "";
    let secondPart = "";
    let areas = "";

    cards.forEach((card,index)=>{
        if(cardPositions[index] == 1){
            areas = areas + "a ";
        }
        else if(cardPositions[index] == 2){
            areas = areas + "b ";
        }
        else if(cardPositions[index] == 3){
            areas = areas + "c ";
        }
        else if(cardPositions[index] == 4){
            areas = areas + "d ";
        }
        if(index == 1){
            firstPart = areas.substring(0,areas.length - 1);
            areas = "";
        }
        else if(index == 3){
            secondPart = areas.substring(0,areas.length - 1);
        }

    });
    return `"${firstPart}" "${secondPart}"`

}

function addCardsToAppropriateCell(){
    cards.forEach((card)=>{
        addCardToGridCell(card);
    });
}

function createCards(){
    cardObjectDefinitions.forEach((cardItem) => {
        createCard(cardItem);
    })
}

function createCard(cardItem){
    const cardElem = createElement('div');
    const cardInnerElem = createElement('div');
    const cardFrontElem = createElement('div');
    const cardBackElem = createElement('div');

    const cardFrontImg = createElement('img');
    const cardBackImg = createElement('img');

    addClassToElements(cardElem, 'card');
    addIdToElements(cardElem, cardItem.id);

    addClassToElements(cardInnerElem, 'card-inner');

    addClassToElements(cardFrontElem, 'card-front');

    addClassToElements(cardBackElem, 'card-back');

    addSrctoImageElem(cardBackImg, cardBackImgPath);

    addSrctoImageElem(cardFrontImg, cardItem.imagePath);

    addClassToElements(cardBackImg, 'card-image');
    addClassToElements(cardFrontImg, 'card-image');

    addChildElement(cardBackElem, cardBackImg);
    addChildElement(cardFrontElem, cardFrontImg);

    addChildElement(cardInnerElem, cardBackElem);
    addChildElement(cardInnerElem, cardFrontElem);

    addChildElement(cardElem, cardInnerElem);
    
    addCardToGridCell(cardElem);

    initializeCardPositions(cardElem);

    attachClickEventHandlerToCard(cardElem);
}

function attachClickEventHandlerToCard(card){
    card.addEventListener('click', () => chooseCard(card));
}

function initializeCardPositions(card){
    cardPositions.push(card.id);
}

function createElement(elemType){
    return document.createElement(elemType);
}

function addClassToElements(elem, className){
    elem.classList.add(className);
}

function addIdToElements(elem, id){
    elem.id = id;
}

function addSrctoImageElem(imgElem, src){
    imgElem.src = src;
}

function addChildElement(parentElem, childElem){
    parentElem.appendChild(childElem);
}

function addCardToGridCell(card){
    const cardPositionClassName = mapCardIdToGridCell(card);
    const cardPosElem = document.querySelector(cardPositionClassName);

    addChildElement(cardPosElem, card);
}

function mapCardIdToGridCell(card){
    if(card.id==1)
    {
        return '.card-pos-a';
    }
    else if(card.id==2)
    {
        return '.card-pos-b';
    }
    else if(card.id==3)
    {
        return '.card-pos-c';
    }
    else
    {
        return '.card-pos-d';
    }
}
