'use strict';

const MAIN_DIV = document.querySelector('main');
const RESULT = document.getElementById('result');

const START_OPEN_IMAGE_TIMEOUT = 300;
const SHOW_OPEN_IMAGE_TIMEOUT = 900;
const SHOW_IMAGES_AT_START_TIMEOUT = 3000;

let currentTime = 0;
let onGame = false;

let lastBestResult = window.localStorage.getItem('result');
if (lastBestResult) RESULT.innerHTML = `Best result ${lastBestResult} seconds`;

let firstOpen, secondOpen;
firstOpen = secondOpen = true; // for unable click at start

let imagesPath = './src/images/';
let imagesArr = [
    'img_001.png',
    'img_002.png',
    'img_003.png',
    'img_004.png',
    'img_005.png',
    'img_006.png',
    'img_007.png',
    'img_008.png',
    'img_009.png',
    'img_010.png',
    'img_011.png',
    'img_012.png'
];
let pairForWin = imagesArr.length;

const imagesPairArr = imagesArr.concat(imagesArr);
let imagesPairArrSize = imagesPairArr.length;
imagesPairArr.sort(()=>Math.random()-0.5);

let openImagesNumber = 0;

let imagesDivArr = [];

for (let i = 0; i < imagesPairArrSize; i++) {
    addImageInMain(imagesPairArr[i]);
}

function addImageInMain (img) {
    let imageDiv = document.createElement('div');
    let clickFunction = `clickImage(this, "${img}")`;
    imageDiv.className = 'flip-box';
    imageDiv.setAttribute('onclick', clickFunction);
    imageDiv.innerHTML = `
        <div class='flip-inner'>
            <div class='flip-inner-logo'>
                <img src=${imagesPath + 'logo.svg'} alt=${'logo-' + img}>
            </div>
            <div class='flip-inner-image'>
                <img class='image' src=${imagesPath + img} alt=${'image-' + img}>
            </div>
        </div>
        `;
    MAIN_DIV.append(imageDiv);
    imagesDivArr.push(imageDiv);
}

let imagesDivArrSize = imagesDivArr.length;
setTimeout(startOpenImage, START_OPEN_IMAGE_TIMEOUT, 0);

function startOpenImage(index) {
    if (index < imagesDivArrSize) {
        imagesDivArr[index].classList.toggle('open');
        setTimeout(startOpenImage, START_OPEN_IMAGE_TIMEOUT, index + 1);
    } else {
        setTimeout(startGame, SHOW_IMAGES_AT_START_TIMEOUT);
    }
}

function startGame() {
    imagesDivArr.forEach(div => div.classList.toggle('open'));
    firstOpen = secondOpen = undefined;
    onGame = true;
    RESULT.innerHTML = `Play time: ${currentTime} seconds`;
    setTimeout(countSeconds, 1000);
}

function clickImage(id, image) {
    if(!firstOpen) {
        id.classList.toggle('open');
        firstOpen = {
            id: id,
            image: image
        };
    }

    if(!secondOpen && firstOpen.id !== id){
        id.classList.toggle('open');
        secondOpen = true;
        testOpenPair(id, image);
    }
}

function testOpenPair(id, image) {
    if (image === firstOpen.image) {
        id.removeAttribute('onclick');
        firstOpen.id.removeAttribute('onclick');

        openImagesNumber++;
        if (openImagesNumber === pairForWin) endGame();
        else firstOpen = secondOpen = undefined;
    } else {
        setTimeout(closeWrongImages, SHOW_OPEN_IMAGE_TIMEOUT, id);
    }
}

function closeWrongImages(id) {
    id.classList.toggle('open');
    firstOpen.id.classList.toggle('open')
    firstOpen = secondOpen = undefined;
}

function endGame() {
    onGame = false;
    RESULT.innerHTML = `Your result: ${currentTime} seconds`;
    if (!lastBestResult || currentTime < Number(lastBestResult)) {
        window.localStorage.setItem('result', currentTime);
    }
}

function countSeconds() {
    if (onGame) {
        currentTime++;
        RESULT.innerHTML = `Play time: ${currentTime} seconds`;
        setTimeout(countSeconds, 1000);
    }
}