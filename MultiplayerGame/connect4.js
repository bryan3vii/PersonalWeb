// Connect 4 game logic
// Player logic
// Author: Bryan Mendoza
// Date: 02/16/2024
// Version: 1.0 (No Multiplayer yet)
// This file contains the logic for the connect 4 game. It sets up the game, and 
// handles the game logic such as setting the piece, checking for a winner, and 
// checking for a tie. It also contains the logic for the sidebar menu, and the reset game button.

var player1 = "1"; // Player 1
var player2 = "2"; // Player 2
var currPlayer = player1; // Current player

// general logic
var gameOver = false; // game over flag

// board logic
var board; // 2D array to keep track of the board
var rows = 6; // number of rows, 6 rows in connect 4
var cols = 7;  // number of columns, 7 columns in connect 4
var currColumns = []; //keeps track of which row each column is at.
// window.onload function to set up the game
window.onload = function() {
    setBoard(); // Set up the game
    randomizePlayer(); // Randomize the player turn
    document.getElementById("current_player").style.visibility = "hidden"; // Hide the current player text

    // Add event listeners for drag
    let tiles = document.querySelectorAll(".tile");
    tiles.forEach(tile => {
        tile.addEventListener("mouseenter", highlightColumn);
        tile.addEventListener("mouseleave", removeHighlightColumn);
    });
    highlightColumnsAtStart();
}// end of window.onload function

// Set up the game
function setBoard() {
    // Clear the existing board (for restart)
    document.getElementById("board").innerHTML = ''; 

    board = []; 
    currColumns = [5, 5, 5, 5, 5, 5, 5]; 
    // Create the board
    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < cols; c++) {
            row.push(' ');
            let tile = document.createElement("div"); // Create a new div element
            tile.id = r.toString() + "-" + c.toString(); // Set the id of the tile
            tile.classList.add("tile"); // Add the tile class to the tile
            tile.addEventListener("click", setPiece);  // Add an event listener to the tile
            document.getElementById("board").append(tile); // Append the tile to the board
        } // end of inner for loop
        board.push(row); // Push the row to the board
    } // end of outer for loop
} // end of setBoard function

// Set the winner
function setWinner(r, c) {
    let winnerText = "";
    let winnerColor = "";
    // Set the winner text and color based on the player
    if (board[r][c] == player1) {
        winnerText = "Player 1 Wins";
        winnerColor = "Black";
    } else {
        winnerText = "Player 2 Wins";
        winnerColor = "Black";
    } // end of if statement

    // Hide the regular winner element
    let winner = document.getElementById("winner");
    winner.style.display = "none";

    // Show the crown animation
    let crown = document.getElementById("crown");
    crown.style.display = "block";
    crown.style.color = winnerColor;

    // Add animation classes
    crown.classList.add("animate__animated", "animate__bounceInDown");

    // Set the winner text
    setTimeout(function() {
        crown.innerText = winnerText;
        crown.classList.remove("animate__bounceInDown");
        crown.classList.add("animate__flipInX");
    }, 1000); // Display the winner message after 1 second

    // Set game over
    gameOver = true;
    setTimeout(resetGame, 10000); 

    // Countdown to reset the game
    let countdown = 10;
    let countdownElement = document.getElementById("countdown");
    countdownElement.innerText = "Game restarting in " + countdown + " seconds"; // Initialize countdown text
    let countdownInterval = setInterval(() => {
        countdown--;
        countdownElement.innerText = "Game restarting in " + countdown + " seconds"; // Update countdown text
        if (countdown == 0) {
            clearInterval(countdownInterval);
            resetGame();
            countdownElement.style.display = "none"; // Hide the countdown element
        } // end of if statement
    }, 1000); // Countdown every second
    countdownElement.style.display = "block";
} // end of setWinner function
 
// Set the piece, and check for a winner
function setPiece() {
    if (gameOver) {
        return;
    } // end of if statement

    let coordinates = this.id.split("-"); // Get the coordinates of the tile
    let r = parseInt(coordinates[0]); // Get the row
    let c = parseInt(coordinates[1]); // Get the column

    // find out which row the piece should be placed
    r = currColumns[c];
    // if the row is less than 0, return (no more pieces can be placed in this column)
    if (r < 0) {
        return;
    } // end of if statement

    board[r][c] = currPlayer; // Set the piece on the board

    let tile = document.getElementById(r.toString() + "-" + c.toString()); // Get the tile
    if (currPlayer == player1) {
        tile.classList.add("piece1"); // Add the piece1 class to the tile
        currPlayer = player2; // Switch the player
    } else {
        tile.classList.add("piece2"); // Add the piece2 class to the tile
        currPlayer = player1; // Switch the player
    } // end of if statement
    r -= 1; // update the row height for the column
    currColumns[c] = r; // update the current row for the column

    // update the turn to display which player's turn it is
    let currentPlayerText = document.getElementById("current_player");
    currentPlayerText.innerText = currPlayer;

    checkTie(); // Check for a tie after each move
    checkWinner(); // Check for a winner
} // end of setPiece function

// we need to check for a winner in the horizontal 
// direction, vertical direction, and both diagonals
function checkWinner() {
    // horizontal
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols - 3; c++){
           if (board[r][c] != ' ') {
               if (board[r][c] == board[r][c+1] && board[r][c+1] == board[r][c+2] && board[r][c+2] == board[r][c+3]) {
                   setWinner(r, c);
                   return;
               } // end of if statement
           } // end of if statement
        } // end of inner for loop
   } // end of for loop
   // vertical
   for (let c = 0; c < cols; c++) {
       for (let r = 0; r < rows - 3; r++) {
           if (board[r][c] != ' ') {
               if (board[r][c] == board[r+1][c] && board[r+1][c] == board[r+2][c] && board[r+2][c] == board[r+3][c]) {
                   setWinner(r, c);
                   return;
               } // end of if statement
           } // end of if statement
       } // end of inner for loop
   } // end of for loop
   // diagonal
   for (let r = 3; r < rows; r++) {
       for (let c = 0; c < cols - 3; c++) {
           if (board[r][c] != ' ') {
               if (board[r][c] == board[r-1][c+1] && board[r-1][c+1] == board[r-2][c+2] && board[r-2][c+2] == board[r-3][c+3]) {
                   setWinner(r, c);
                   return;
               } // end of if statement
           } // end of if statement
       } // end of inner for loop
   } // end of for loop
     // backwards diagonal
     for (let r = 0; r < rows - 3; r++) {
        for (let c = 0; c < cols - 3; c++) {
            if (board[r][c] != ' ') {
                if (board[r][c] == board[r+1][c+1] && board[r+1][c+1] == board[r+2][c+2] && board[r+2][c+2] == board[r+3][c+3]) {
                    setWinner(r, c);
                    return;
                } // end of if statement
            } // end of if statement
        } // end of inner for loop
    }// end of for loop
}// end of checkWinner function

// Function to check for a tie
function checkTie() {
    for (let c = 0; c < cols; c++) {
        if (board[0][c] === ' ') {
            return; // If ther e's an empty cell at the top row, the game can continue
        } // end of if statement
    } // end of for loop
    setTimeout(function() {
        alert("It's a tie!");  // alert instead of innerText
        resetGame();
    }, 1000); // Display the tie message after 1 second
} // end of checkTie function

// Randomize the player
function randomizePlayer() {
    currPlayer = Math.random() < 0.5 ? player1 : player2; // Randomly choose player1 or player2
    let currentPlayerText = document.getElementById("current_player");
    currentPlayerText.innerText = currPlayer;
}
// Highlight the column when dragging over it
function highlightColumn(event) {
    let coordinates = this.id.split("-");
    let c = parseInt(coordinates[1]);
    // if current player is player1, highlight the column, else highlight the column for player2
    let highlightColor = (currPlayer == player1) ? "#eb4667" : "#08d11d"; // Choose color based on current player

    // highlight only tiles that are empty
    for (let r = 0; r < rows; r++) {
        let tile = document.getElementById(r.toString() + "-" + c.toString());
        if (board[r][c] === ' ') { // Check if the tile is empty
            tile.style.backgroundColor = highlightColor; // Highlight the tile
            tile.style.transition = "background-color 0.1s ease"; 
        } // end of if statement
    } // end of for loop
} // end of highlightColumn function

// Remove highlight from the column when not dragging over it
function removeHighlightColumn(event) {
    let tiles = document.querySelectorAll(".tile");
    tiles.forEach(tile => tile.style.backgroundColor = "");
} // end of removeHighlightColumn function

// Function to highlight columns at the start of the game
function highlightColumnsAtStart() {
    let tiles = document.querySelectorAll(".tile");
    for (let c = 0; c < cols; c++) {
        let tile = document.getElementById("0-" + c.toString()); // Get the top tile of the column
        tile.dispatchEvent(new Event("mouseenter")); // Trigger mouseenter event for the tile
    } // end of for loop
} // end of highlightColumnsAtStart function

// Reset the game button
function resetGame() {
    let winner = document.getElementById("winner");
    winner.innerText = "";
    gameOver = false;
    // swap the current player
    if (currPlayer == player2) {
    currPlayer = player1; // Reset the current player to player1
    } else {
        currPlayer = player2; // Reset the current player to player2
    } // end of if statement 
    board = [];
    currColumns = [5, 5, 5, 5, 5, 5, 5];
    
    // Clear the board by removing all pieces
    let tiles = document.querySelectorAll(".tile");
    for (let i = 0; i < tiles.length; i++) {
        tiles[i].classList.remove("piece1");
        tiles[i].classList.remove("piece2");
    } // end of for loop

    // Remove existing event listeners
    tiles.forEach(tile => {
        tile.removeEventListener("mouseenter", highlightColumn);
        tile.removeEventListener("mouseleave", removeHighlightColumn);
    }); // end of for loop

    // Set up the game again and add event listeners
    setBoard();

    tiles = document.querySelectorAll(".tile"); // Get tiles again after setting up the board
    tiles.forEach(tile => {
        tile.addEventListener("mouseenter", highlightColumn);
        tile.addEventListener("mouseleave", removeHighlightColumn);
    }); // end of for loop

    // Reset the visibility of the current player text
    document.getElementById("current_player").style.visibility = "hidden";
    
    // Hide the crown element and reset its content and animation classes
    let crown = document.getElementById("crown");
    crown.style.display = "none";
    crown.innerText = "";
    crown.classList.remove("animate__animated", "animate__bounceInDown", "animate__flipInX");
    
    // hide the countdown
    document.getElementById("countdown").style.display = "none";
} // end of resetGame function

/* Set the width of the sidebar to 250px (show it) */
function openNav() {
    document.getElementById("mySidepanel").style.width = "250px";
  } //  end of openNav function
  
  /* Set the width of the sidebar to 0 (hide it) */
  function closeNav() {
    document.getElementById("mySidepanel").style.width = "0";
  }// end of openNav and closeNav functions

  /* ADD FUNCTIONALITY TO ALLOW MULTIPLAYER ONLINE GAMPEPLAY */
  /* 


                            EMPTY


  */