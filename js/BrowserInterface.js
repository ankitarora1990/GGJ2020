/**
 * Starting module.
 */
(function($) {

  // How long a non matching card is displayed once clicked.
  var nonMatchingCardTime = 500;



  var timerObj = {
    second: 0, 
    minute: 0,
    hour: 0
  };

  // Handle Timer to start
  var timer = document.querySelector(".timer");
    timer.innerHTML = "0 mins 0 secs";

    // Handle redering of Attempts
    var points = document.querySelector(".points");
    points.innerHTML = "Attempts:   Mistakes: ";

    // Handle start of music

    //1
    //var themeAudioPlayer = document.getElementById("theme-audio")
    //   themeAudioPlayer.play();

    //2
    // document.body.addEventListener("mousemove", function () {
    //   var themeAudioPlayer = document.getElementById("theme-audio")
    //   themeAudioPlayer.play();
    // })

    //3
    // var themeAudioPlayer = document.getElementById("theme-audio")
    //   themeAudioPlayer.muted = true;
    //   themeAudioPlayer.play();
    
    //4
    // var fakeBtn = document.getElementById('btnFake');
    // fakeBtn.addEventListener('click', myPlay, false);
    // fakeBtn.click();

    // function myPlay()
    // {
    //   var themeAudioPlayer = document.getElementById("theme-audio")
    //   themeAudioPlayer.muted = true;
    //   themeAudioPlayer.play();
    // }
    
    //5
    // var audio = new Audio('music/Re-Pair.mp3');
    // var playPromise = audio.play();
    

 // Handle clicking on Play music icon
//  var settings = document.getElementById('memory-settings-play-icon');
//  var handlePlayMusic = function (event) {
//    event.preventDefault();
//    var audio = null;
//    if(sessionStorage.getItem("diff_h") === "6"){
//     audio = new Audio('music/3. Seriously_.mp3');
//    }
//    else{
//     audio = new Audio('music/Re-Pair.mp3');
//    }

//    var playPromise = audio.play();
//  };
//  settings.addEventListener('click', handlePlayMusic);

// Handle clicking on Next Level
var btnNextLevel = document.getElementById('btnNextLevel');
var handlePlayNext = function (event) {
  event.preventDefault();
  sessionStorage.diff_w = Number(sessionStorage.getItem("diff_w")) + 1;
  sessionStorage.diff_h = Number(sessionStorage.getItem("diff_h")) + 1;
  window.location.reload();
};
btnNextLevel.addEventListener('click', handlePlayNext);

  // Handle clicking on settings icon
  //  var settings = document.getElementById('memory-settings-icon');
  //  var modal = document.getElementById('memory-settings-modal');
  //  var handleOpenSettings = function (event) {
  //    event.preventDefault();
  //    modal.classList.toggle('show');
  //  };
  //  settings.addEventListener('click', handleOpenSettings);

  // Handle clicking on card
  var handleFlipCard = function (event) {
    event.preventDefault();

    var flipAudio = new Audio('music/Card Flip.wav');
    var flipAudioPlayPromise = flipAudio.play();

    var status = $.play(this.index);
    console.log(status);

    if (status.code != 0 ) {
      this.classList.toggle('clicked');
    }

    if (status.code == 3 ) {
      setTimeout(function () {
        var childNodes = document.getElementById('memory-cards').childNodes;
        childNodes[status.args[0]].classList.remove('clicked');
        childNodes[status.args[1]].classList.remove('clicked');
      }.bind(status), nonMatchingCardTime);
    }
    else if (status.code == 4) {
      var score = parseInt((($.attempts - $.mistakes) / $.attempts) * 100, 10);
      var message = getEndGameMessage(score);
      $.stopTimer();

      document.getElementById('memory-end-game-message').textContent = message;
      document.getElementById('memory-end-game-score').textContent =
          'Score: ' + score + ' / 100';

      document.getElementById("memory-end-game-modal").classList.toggle('show');
    }

  };

  var getEndGameMessage = function(score) {
    var message = "";
    var mky = document.querySelector('.bt_monkey');
    mky.style.display="none";

    // mky.style.webkitAnimationPlayState = "paused";
    // mky.style.left = "50%";
    // mky.style.top="-60%";
    if (score == 100) {
      message = "Yay. The good monkey won!"
      var emky = document.querySelector('.end_monkey1');
      emky.style.display="block";
      emky.style.left = "50%";
      emky.style.top="-60%";
    }
    else if (score >= 70 ) {
      message = "Yay. The good monkey won!"
      var emky = document.querySelector('.end_monkey1');
      emky.style.display="block";
      emky.style.left = "50%";
      emky.style.top="-60%";
    }
    else if (score >= 50) {
      message = "Oh no! The evil monkey won!";
      var emky2 = document.querySelector('.end_monkey2');
      emky2.style.display="block";
      emky2.style.left = "50%";
      emky2.style.top="-60%";
    }
    else {
      message = "Oh no! The evil monkey won!";
      var emky2 = document.querySelector('.end_monkey2');
      emky2.style.display="block";
      emky2.style.left = "50%";
      emky2.style.top="-60%";
    }

    return message;
  }

  // Build grid of cards
  var buildLayout = function (cards, rows, columns, imgOffset) {
    if (!cards.length) {
      return;
    }

    var memoryCards = document.getElementById("memory-cards");
    var index = 0;

    var cardMaxWidth = document.getElementById('memory-app-container').offsetWidth / columns;
    var cardHeightForMaxWidth = cardMaxWidth * (3 / 4);

    var cardMaxHeight = document.getElementById('memory-app-container').offsetHeight / rows;
    var cardWidthForMaxHeight = cardMaxHeight * (4 / 3);

    // Clean up. Remove all child nodes and card clicking event listeners.
    while (memoryCards.firstChild) {
      memoryCards.firstChild.removeEventListener('click', handleFlipCard);
      memoryCards.removeChild(memoryCards.firstChild);
    }

    for (var i = 0; i < rows; i++) {
      for (var j = 0; j < columns; j++) {
        // Use cloneNode(true) otherwise only one node is appended
        memoryCards.appendChild(buildCardNode(index, cards[index],
          (100 / columns) + "%", (100 / rows) + "%", imgOffset));
        index++;
      }
    }

    // Resize cards to fit in viewport
    if (cardMaxHeight > cardHeightForMaxWidth) {
      // Update height
      memoryCards.style.height = (cardHeightForMaxWidth * rows) + "px";
      memoryCards.style.width = document.getElementById('memory-app-container').offsetWidth + "px";
      memoryCards.style.top = ((cardMaxHeight * rows - (cardHeightForMaxWidth * rows)) / 2) + "px";
    }
    else {
      // Update Width
      memoryCards.style.width = (cardWidthForMaxHeight * columns) + "px";
      memoryCards.style.height = document.getElementById('memory-app-container').offsetHeight + "px";
      memoryCards.style.top = 0;
    }

  };

  // Update on resize
  window.addEventListener('resize', function() {
    buildLayout($.cards, $.settings.rows, $.settings.columns, $.settings.imgOffset);
  }, true);

  // Build single card
  var buildCardNode = function (index, card, width, height, imgOffset) {
    var flipContainer = document.createElement("li");
    var flipper = document.createElement("div");
    var front = document.createElement("a");
    var back = document.createElement("a");

    flipContainer.index = index;
    flipContainer.style.width = width;
    flipContainer.style.height = height;
    flipContainer.style.marginBottom ="-1%";
    flipContainer.style.marginLeft ="-1%";
    flipContainer.classList.add("flip-container");
    if (card.isRevealed) {
      flipContainer.classList.add("clicked");
    }

    flipper.classList.add("flipper");
    front.classList.add("front");
    front.setAttribute("href", "#");
    back.classList.add("back");
    back.classList.add("card"); 
    back.classList.add("card-" + (card.value+imgOffset));
    if (card.isMatchingCard) {
      back.classList.add("matching");
    }
    back.setAttribute("href", "#");

    flipper.appendChild(front);
    flipper.appendChild(back);
    flipContainer.appendChild(flipper);

    flipContainer.addEventListener('click', handleFlipCard);

    return flipContainer;
  };
  var w=Number(sessionStorage.getItem("diff_w"));
  var h=Number(sessionStorage.getItem("diff_h"));
  // Shuffle card images: How many different images are available to shuffle from?
  var imagesAvailable = 0;
  var imgOffset =0;
  if(w===2 && h===3){
    imagesAvailable=15;//fruits
    imgOffset=0;
  }
  else if(w===3 && h===4){
    imagesAvailable=15;//buildings
    imgOffset=0;
  }
  else if(w===4 && h===5){
    imagesAvailable=15;//furs
    imgOffset=15;
  }else if(w===5 && h===6){
    imagesAvailable=15;//sat images
    imgOffset=30;
  }
  var cards = $.initialize(w, h, imagesAvailable, imgOffset, timerObj);

  if (cards) {
    // document.getElementById('memory-settings-modal').classList.remove('show');
    document.getElementById('memory-end-game-modal').classList.remove('show');
    document.getElementById('memory-end-game-message').innerText = "";
    document.getElementById('memory-end-game-score').innerText = "";
    buildLayout($.cards, $.settings.rows, $.settings.columns, $.settings.imgOffset);
  }
})(MemoryGame);
