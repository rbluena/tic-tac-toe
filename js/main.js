(function () {
  var player1 = new Player("user");
  var player2 = new Player("computer");
  let game = new Game();
  let state = new State();
  const WINNING_COMBINATIONS = [
    ["0,0", "0,1", "0,2"],
    ["1,0", "1,1", "1,2"],
    ["2,0", "2,1", "2,2"],
    ["0,0", "1,0", "2,0"],
    ["0,1", "1,1", "2,1"],
    ["0,2", "1,2", "2,2"],
    ["0,0", "1,1", "2,2"],
    ["0,2", "1,1", "2,0"],
  ];
  game.init();

  /**
   * State prototype constructor
   */
  function State() {
    var localState = {
      currPlayer: "player1",
      rows: [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
      ],
      isGameOver: false,
      theWinner: null,
    };

    /**
     * Return a user to play next
     *
     * @returns string
     */
    function getCurrPlayer() {
      return localState.currPlayer;
    }

    /**
     * Change a current user to play
     */
    function changeCurrPlayer() {
      localState.currPlayer =
        localState.currPlayer === player1.getId()
          ? player2.getId()
          : player1.getId();
    }

    function userPlayed(playedUser, changedCell) {
      let [index1, index2] = changedCell.split(",");
      localState.rows[index1][index2] = playedUser;

      changeCurrPlayer();
      return isGameOver();
    }

    function isGameOver() {
      function checkIfGameIsOver() {
        for (let i = 0; i < WINNING_COMBINATIONS.length; i++) {
          const combination = WINNING_COMBINATIONS[i];
          let j = 0;

          while (j < combination.length) {
            let [index0, index1] = combination[0].split(",");
            let [index2, index3] = combination[1].split(",");
            let [index4, index5] = combination[2].split(",");

            if (j === 2) {
              let cell1 = localState.rows[index0][index1];
              let cell2 = localState.rows[index2][index3];
              let cell3 = localState.rows[index4][index5];
              let check =
                cell1 !== 0 &&
                cell2 !== 0 &&
                cell3 !== 0 &&
                cell1 === cell2 &&
                cell2 === cell3;

              if (check) {
                localState.isGameOver = true;
                localState.theWinner = cell1;
                return;
              }
            }

            j++;
          }
        }
      }

      checkIfGameIsOver();
      return {
        isGameOver: localState.isGameOver,
        theWinner: localState.theWinner,
      };
    }

    return {
      getCurrPlayer,
      userPlayed,
      isGameOver,
    };
  }

  /**
   * Player prototype constructor
   */
  function Player(id) {
    let playerId = id;

    function getId() {
      return playerId;
    }

    function play() {}

    return {
      getId,
      play,
    };
  }

  /**
   * Game prototype constructor
   */
  function Game() {
    function play(el) {
      let isGameOver = false;
      let theWinner = null;

      if (state.getCurrPlayer() === player1.getId()) {
        el.style.backgroundColor = "red";
        // user.play(selectionValue);
        ({ isGameOver, theWinner } = state.userPlayed(
          player1.getId(),
          el.dataset.value
        ));
      } else {
        el.style.backgroundColor = "blue";
        // computer.play(selectionValue);
        ({ isGameOver, theWinner } = state.userPlayed(
          player2.getId(),
          el.dataset.value
        ));
      }

      if (isGameOver) {
        const boardContainer = document.querySelector(".board");
        const leaderBoard = boardContainer.querySelector(".leader-board");

        if (theWinner) {
          let title = document.createElement("h2");
          title.classList.add("title");
          title.appendChild(
            document.createTextNode("The winner is " + theWinner)
          );

          leaderBoard.appendChild(title);
          leaderBoard.style.display = "block";
        }
      }
    }

    function initializeGame() {
      let cells = document.querySelectorAll(".board__cell");

      cells.forEach((cell) => {
        cell.addEventListener(
          "click",
          function (evt) {
            play(this);
          },
          { once: true }
        );
      });
    }

    function init() {
      initializeGame();
    }

    return {
      init,
    };
  }
})();
