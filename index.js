async function setup() {
  let firstCard = null;
  let secondCard = null;
  let hasCompare = false;
  let currentPairs = 0;
  let userClicks = 0;
  let remainingPairs;
  let timer;
  let seconds = 0;
  let totalTime;
  const difficulty = $("input[name='options']:checked").val();
  let cardAmount;

  if (difficulty === "easy") {
    totalTime = 100;
    cardAmount = 6;
  } else if (difficulty === "medium") {
    totalTime = 200;
    cardAmount = 12;
  } else {
    totalTime = 300;
    cardAmount = 24;
  }

  const maxPairs = cardAmount / 2;
  remainingPairs = maxPairs - currentPairs;

  const pokemons = await getRandomPokemons(cardAmount / 2);
  const pokemonSprites = pokemons.flatMap(pokemon => [pokemon.sprites.front_default, pokemon.sprites.front_default]);

  populateGrid(cardAmount, pokemonSprites);



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

  async function getRandomPokemons(count) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${count}`);
    const data = await response.json();
    const pokemonList = data.results;

    const promise = pokemonList.map(async pokemon => {
      const response = await fetch(pokemon.url);
      return await response.json();
    });

    return Promise.all(promise);
  }

  function populateGrid(cardAmount, pokemonImages) {
    const gameGrid = $("#game_grid");
    gameGrid.empty(); // Clear the game grid

    for (let i = 1; i <= cardAmount; i++) {
      const card = $("<div>")
        .addClass("card")
        .append($("<img>").addClass("back_face").attr("src", "back.webp"))
        .append($("<img>").addClass("front_face").attr("id", "img" + i).attr("src", getRandomImage(pokemonImages)));
      gameGrid.append(card);
    }
  }

  function getRandomImage(pokemonImages) {
    const randomIndex = Math.floor(Math.random() * pokemonImages.length);
    const image = pokemonImages[randomIndex];
    pokemonImages.splice(randomIndex, 1); // Remove the selected image from the array
    return image;
  }
}

$(document).ready(() => {
  $("#startButton").show();
  $("#game_grid").hide();

  $("#startButton").on("click", () => {
    $("#startButton").hide();
    setup();
  });
});
