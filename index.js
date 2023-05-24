const setup = () => {
  let firstCard = null;
  let secondCard = null;
  let hasCompare = false;
  const maxPairs = $(".card").length / 2;
  let currentPairs = 0;
  let userClicks = 0;
  let remainingPairs = maxPairs - currentPairs;
  let timer;
  let seconds = 0;

  function startTimer() {
    timer = setInterval(() => {
      seconds++;
      updateHeader();
    }, 1000);
  }

  function stopTimer() {
    clearInterval(timer);
  }

  function resetCards() {
    firstCard = null;
    secondCard = null;
    console.log("Reset cards");
  }

  function winGame() {
    if (currentPairs === maxPairs) {
      alert("Winner!");
      stopTimer();
    }
  }

  function updateRemainingPairs() {
    remainingPairs = maxPairs - currentPairs;
  }

  function updateHeader() {
    $('#header').text(`
    Total Clicks: ${userClicks} \n
    Pairs Left: ${remainingPairs} \n
    Number of Pairs Matched: ${currentPairs} \n
    Total Pairs: ${maxPairs} \n
    Time: ${seconds} seconds
    `);
  }

  updateHeader();

  $(".card").on(("click"), function () {
    if ($(this).hasClass("flip") || hasCompare) {
      console.log("same card pressed");
      return;
    }

    $(this).toggleClass("flip");
    userClicks++;
    updateHeader();

    if (!firstCard)
      firstCard = $(this).find(".front_face")[0];
    else {
      secondCard = $(this).find(".front_face")[0];
      console.log(firstCard, secondCard);
      if (firstCard.src === secondCard.src) {
        console.log("match");
        $(`#${firstCard.id}`).parent().off("click");
        $(`#${secondCard.id}`).parent().off("click");
        resetCards();
        currentPairs++;
        updateRemainingPairs();
        updateHeader();
        setTimeout(() => {
          winGame();
        }, 1000);
      } else {
        console.log("no match");
        hasCompare = true;
        updateHeader();
        setTimeout(() => {
          $(`#${firstCard.id}`).parent().toggleClass("flip");
          $(`#${secondCard.id}`).parent().toggleClass("flip");
          resetCards();
          hasCompare = false;
        }, 1000);
      }
    }
  });

  startTimer();

}

$(document).ready(setup);
