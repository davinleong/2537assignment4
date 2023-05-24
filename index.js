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
  let totalTime;
  const difficulty = $("input[name='options']:checked").val();

  if (difficulty === "easy") {
    totalTime = 100;
    cardAmount = 6;
  } else if (difficulty === "medium") {
    totalTime = 200;
    cardAmount = 12;
  } else {
    totalTime = 300;
    cardAmount = 18;
  }

  function startTimer() {
    timer = setInterval(() => {
      seconds++;
      updateHeader();
      if (seconds >= totalTime) {
        clearInterval(timer);
        loseGame();
      }
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

  function loseGame() {
    stopTimer();
    $("#container").text("Time's up!");
    $("#game_grid").text("Try again!");

    $("#game_grid").on("click", () => {
      window.location.href = "./index.html";
    });
  }

  function updateRemainingPairs() {
    remainingPairs = maxPairs - currentPairs;
  }

  function updateHeader() {
    $("#header").text(`
    Total Clicks: ${userClicks} \n
    Pairs Left: ${remainingPairs} \n
    Number of Pairs Matched: ${currentPairs} \n
    Total Pairs: ${maxPairs} \n
    Max Time: ${totalTime} - Current Time: ${seconds} seconds
    `);
  }

  updateHeader();

  $(".card").on("click", function () {
    if ($(this).hasClass("flip") || hasCompare) {
      console.log("same card pressed");
      return;
    }

    $(this).toggleClass("flip");
    userClicks++;
    updateHeader();

    if (!firstCard) firstCard = $(this).find(".front_face")[0];
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
  $("#game_grid").show();

  // Fetch random Pokemon data
  const url = "https://pokeapi.co/api/v2/pokemon?limit=" + cardAmount;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const pokemonList = data.results;

      // Randomly select unique Pokemon cards
      const selectedCards = [];
      while (selectedCards.length < cardAmount) {
        const randomIndex = Math.floor(Math.random() * pokemonList.length);
        const selectedPokemon = pokemonList[randomIndex];
        if (!selectedCards.includes(selectedPokemon)) {
          selectedCards.push(selectedPokemon);
          selectedCards.push(selectedPokemon);
        }
      }

      // Populate card images
      $(".front_face").each(function (index) {
        const card = $(this).parent();
        const cardImg = $(this);
        const selectedPokemon = selectedCards[index];
        const pokemonId = selectedPokemon.url.split("/")[6];
        const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;
        cardImg.attr("src", imageUrl);
        cardImg.attr("alt", selectedPokemon.name);
      });
    })
    .catch((error) => console.log(error));
};

$(document).ready(() => {
  $("#startButton").show();
  $("#game_grid").hide();

  $("#startButton").on("click", () => {
    $("#startButton").hide();
    setup();
  });
});
