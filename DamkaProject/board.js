var forcedKillOnBoard = false;
var allowkillNextMove;
var anotherdKillForThisTurn = false;
var numOfKillInThisTurn = 0;
var numOfKingsMoveWithoutKill = 0;
function createBoard() {
    var board = document.createElement("div");
    board.id = "board";
    board.rows =
        [
            createRow(1),
            createRow(2),
            createRow(3),
            createRow(4),
            createRow(5),
            createRow(6),
            createRow(7),
            createRow(8)
        ];
    for (var i = 0; i < board.rows.length; i++) {
        console.log(board.rows[i].id);
        console.log(board.rows[i]);
        board.insertBefore(board.rows[i], board.childNodes[i]);
    }
    document.body.appendChild(board);
    console.log(board.rows);
    renderCheckers();
    return board;
}

function createRow(rowNum) {
    var row = document.createElement("div");
    row.id = "row-" + rowNum;
    row.className = "row";

    row.cells =
        [
            createCell(rowNum, 1),
            createCell(rowNum, 2),
            createCell(rowNum, 3),
            createCell(rowNum, 4),
            createCell(rowNum, 5),
            createCell(rowNum, 6),
            createCell(rowNum, 7),
            createCell(rowNum, 8)
        ];

    for (var i = 0; i < row.cells.length; i++) {
        console.log(row.cells[i].id);
        console.log(row.cells[i]);
        row.insertBefore(row.cells[i], row.childNodes[i]);
    }
    console.log(row.cells);
    return row;
}

function createCell(rowNum, cellNum) {
    var cell = document.createElement("div");
    cell.id = "cell-" + rowNum + '-' + cellNum;
    if (cellColor(rowNum, cellNum) === 'black') {
        cell.className = "cell black";
    } else {
        cell.className = "cell white";
    }
    return cell;
}
function moveSelectedCheckerHere() {
    if (selectedChecker) {
        var blackCell = this;
        var id = blackCell.id;
        var idParts = id.split('-');
        checkerRow = selectedChecker.row;
        checkerCell = selectedChecker.cell;

        cellRow = Number(idParts[1])
        cell = Number(idParts[2]);
        var numOfCheckersBeforMove = checkers.length;

        if (isALegalMove(selectedChecker, blackCell)) {
            selectedChecker.row = cellRow;
            selectedChecker.cell = cell;

            if (positionOfOpponentCheckerToKill != undefined) {
                checkers.splice(positionOfOpponentCheckerToKill, 1);
                positionOfOpponentCheckerToKill = undefined;
            }

            if (selectedChecker.color == `black` && selectedChecker.row == 1) {
                selectedChecker.isKing = true
            } else if (selectedChecker.color == `white` && selectedChecker.row == 8) {
                selectedChecker.isKing = true
            }
            renderCheckers();
            var numOfCheckersAfterMove = checkers.length;
            if (numOfCheckersAfterMove != numOfCheckersBeforMove) {
                numOfKillInThisTurn++;
                numOfKingsMoveWithoutKill = 0;
            }
            if (numOfKillInThisTurn > 0 && isThereAForcedKillForThisChecker(selectedChecker,selectedChecker.color)) {
            } else {
                if (selectedChecker.isKing) {
                    if (numOfCheckersAfterMove == numOfCheckersBeforMove) {
                        numOfKingsMoveWithoutKill++;
                        isDraw(numOfKingsMoveWithoutKill);
                    }
                } else {
                    numOfKingsMoveWithoutKill = 0;
                }
                isThereAForcedKillOnBoard();
                selectedChecker = undefined;
                turn = turn == "white" ? "black" : "white";
                numOfKillInThisTurn = 0;
            }
        }

    }
    console.log(`select a checker, foo!`)
}

function cellColor(cellNum, rowNum) {
    return parity(cellNum) == parity(rowNum) ? 'white' : 'black'
}

/*** Helper Methods ***/
function parity(num) {
    return (num % 2 == 0) ? 'even' : 'odd';
}

function clearBoard(firstBoard) {
    if (!firstBoard) {

        var blackCells = document.getElementsByClassName("black cell");
        console.log(blackCells);
        for (var index = 0; index < blackCells.length; index++) {
            var cell = blackCells[index];
            while (cell.firstChild) {
                cell.removeChild(cell.firstChild);
            }
            cell.removeEventListener("click", moveSelectedCheckerHere);
        }
    }
}
function isThereAForcedKillOnBoard() {
    if (!(anotherdKillForThisTurn)) {
        console.log("in function isThereAForcedKillOnBoard")
        var allCheckers = checkers;
        for (var i = 0; i < allCheckers.length; i++) {
            if (allCheckers[i].color != turn) {
                var checker = allCheckers[i];
                var color = turn == "white" ? "black" : "white";
                
if ( isThereAForcedKillForThisChecker(checker, color)) {
    forcedKillOnBoard=true;
    // anotherdKillForThisTurn=false;
}
            }
        }
    }
    
    return forcedKillOnBoard;
}

// function isThereAForcedKillOnBoard() {
//     console.log(numOfKillInThisTurn, " =======numOfKillInThisTurn")
//     if (!(anotherdKillForThisTurn)) {
//         var allCheckers = checkers;
//         for (var i = 0; i < allCheckers.length; i++) {
//             if (allCheckers[i].color != turn) {
//                 var checker = allCheckers[i];

//                 for (var j = 0; j < allCheckers.length; j++) {
//                     if (allCheckers[j].color == turn) {
//                         var opponentChecker = allCheckers[j];
//                         if (checker.color == "white" || checker.isKing) {
//                             var emptyCell = document.getElementById("cell-" + (checker.row + 2) + "-" + (checker.cell + 2));
//                             if (((checker.row + 1 == opponentChecker.row) && (checker.cell + 1 == opponentChecker.cell)) &&
//                                 (emptyCell != null && emptyCell.children.length <= 0)) {
//                                 var checkerDiv = document.getElementById("checker-" + i)
//                                 checkerDiv.classList.add("ready-to-kill");
//                                 console.log("There is A Forced Kill on row" + checker.row + " " + checker.cell)
//                                 forcedKillOnBoard = true;
//                             }
//                             emptyCell = document.getElementById("cell-" + (checker.row + 2) + "-" + (checker.cell - 2));
//                             if (((checker.row + 1 == opponentChecker.row) && (checker.cell - 1 == opponentChecker.cell)) &&
//                                 (emptyCell != null && emptyCell.children.length <= 0)) {
//                                 var checkerDiv = document.getElementById("checker-" + i)
//                                 checkerDiv.classList.add("ready-to-kill");
//                                 console.log("There is A Forced Kill on row" + checker.row + " " + checker.cell)
//                                 forcedKillOnBoard = true;
//                             }
//                         }

//                         if (checker.color == "black" || checker.isKing) {
//                             var emptyCell = document.getElementById("cell-" + (checker.row - 2) + "-" + (checker.cell + 2));
//                             if (((checker.row - 1 == opponentChecker.row) && (checker.cell + 1 == opponentChecker.cell)) &&
//                                 (emptyCell != null && emptyCell.children.length <= 0)) {
//                                 var checkerDiv = document.getElementById("checker-" + i)
//                                 checkerDiv.classList.add("ready-to-kill");
//                                 console.log("There is A Forced Kill on row" + checker.row + " " + checker.cell)
//                                 forcedKillOnBoard = true;
//                             }
//                             emptyCell = document.getElementById("cell-" + (checker.row - 2) + "-" + (checker.cell - 2));
//                             if (((checker.row - 1 == opponentChecker.row) && (checker.cell - 1 == opponentChecker.cell)) &&
//                                 (emptyCell != null && emptyCell.children.length <= 0)) {
//                                 var checkerDiv = document.getElementById("checker-" + i)
//                                 checkerDiv.classList.add("ready-to-kill");
//                                 console.log("There is A Forced Kill on row" + checker.row + " " + checker.cell)
//                                 forcedKillOnBoard = true;
//                             }
//                         }
//                     }
//                 }
//             }
//         }
//     }

//     return forcedKillOnBoard;
// }
function isThereAForcedKillForThisChecker(checker, checkerColor) {
    
    var emptyCell;
        anotherdKillForThisTurn = false;
    var allCheckers = checkers;
    console.log("checkerColor=",checkerColor)
    for (var j = 0; j < allCheckers.length; j++) {
        if (allCheckers[j].color != checkerColor) {
            var opponentChecker = allCheckers[j];

            if (checkerColor == "white" || checker.isKing || numOfKillInThisTurn > 0) {
                emptyCell = document.getElementById("cell-" + (checker.row + 2) + "-" + (checker.cell + 2));
                if (((checker.row + 1 == opponentChecker.row) && (checker.cell + 1 == opponentChecker.cell)) &&
                    (emptyCell != null && emptyCell.children.length <= 0)) {
                    var checkerDiv = document.getElementById("cell-" + (checker.row) + "-" + (checker.cell)).firstChild;
                    checkerDiv.classList.add("ready-to-kill");
                    console.log("There is A Forced Kill on row" + checker.row + " " + checker.cell)
                    anotherdKillForThisTurn = true;
                }
                emptyCell = document.getElementById("cell-" + (checker.row + 2) + "-" + (checker.cell - 2));
                if (((checker.row + 1 == opponentChecker.row) && (checker.cell - 1 == opponentChecker.cell)) &&
                    (emptyCell != null && emptyCell.children.length <= 0)) {
                    var checkerDiv = document.getElementById("cell-" + (checker.row) + "-" + (checker.cell)).firstChild;
                    checkerDiv.classList.add("ready-to-kill");
                    console.log("checkerColor=",checkerColor," opponentChecker.row =",opponentChecker.row, " opponentChecker.cell=" ,opponentChecker.cell)
                    console.log("There is A Forced Kill on row" + checker.row + " " + checker.cell)
                    anotherdKillForThisTurn = true;
                }
            }

            if (checkerColor == "black" || checker.isKing || numOfKillInThisTurn > 0) {
                console.log("numOfKillInThisTurn>0 ==", numOfKillInThisTurn > 0)

                var emptyCell = document.getElementById("cell-" + (checker.row - 2) + "-" + (checker.cell + 2));
                if (((checker.row - 1 == opponentChecker.row) && (checker.cell + 1 == opponentChecker.cell)) &&
                    (emptyCell != null && emptyCell.children.length <= 0)) {
                    var checkerDiv = document.getElementById("cell-" + (checker.row) + "-" + (checker.cell)).firstChild;
                    checkerDiv.classList.add("ready-to-kill");
                    console.log("There is A Forced Kill on row" + checker.row + " " + checker.cell)
                    anotherdKillForThisTurn = true;
                }
                emptyCell = document.getElementById("cell-" + (checker.row - 2) + "-" + (checker.cell - 2));
                if (((checker.row - 1 == opponentChecker.row) && (checker.cell - 1 == opponentChecker.cell)) &&
                    (emptyCell != null && emptyCell.children.length <= 0)) {
                    var checkerDiv = document.getElementById("cell-" + (checker.row) + "-" + (checker.cell)).firstChild;
                    checkerDiv.classList.add("ready-to-kill");
                    console.log("There is A Forced Kill on row" + checker.row + " " + checker.cell)
                    anotherdKillForThisTurn = true;
                }
            }
        }
    }
    return anotherdKillForThisTurn;

}


function isThereAWin(checkers, turn) {
    opponentOutOfCheckers(checkers);
    opponentCannotMoveWin(turn);
}


function opponentOutOfCheckers(checkers) {
    var numOfBlackCheckers = 0;
    var numOfWhiteCheckers = 0;
    for (let index = 0; index < checkers.length; index++) {
        var checker = checkers[index];

        if (checker.color == "black") {
            numOfBlackCheckers++;
            console.log(numOfBlackCheckers)
        }
        if (checker.color == "white") {
            numOfWhiteCheckers++;
            console.log(numOfWhiteCheckers)
        }
    }
    if (numOfBlackCheckers == 0) {
        clearBoard();
        alert("GAME OVER: WHITE PLYAR WON")
    }
    if (numOfWhiteCheckers == 0) {
        clearBoard();
        alert("GAME OVER: BLACK PLYAR WON")
    }
}
function opponentCannotMoveWin(turn) {
    var win = true;
    var color = turn == "white" ? "black" : "white";
    var allBlackCells = document.getElementsByClassName("cell black");
    var allOpponentCheckers = document.getElementsByClassName(color + "-checker");
    for (let index = 0; index < allOpponentCheckers.length; index++) {
        var checkerDiv = allOpponentCheckers[index];
        var i = checkerDiv.id.split("-")[1];
        var checker = checkers[i];
        console.log("checker =======", checker)
        for (let j = 0; j < allBlackCells.length; j++) {
            var cell = allBlackCells[j];
            if (isALegalMove(checker, cell)) {
                positionOfOpponentCheckerToKill = undefined;
                win = false;
                break;
            }
        }

    }
    if (win) {
        alert("GAME OVER: " + turn + " PLYAR WON," + color + "Cannot Move")
        setTimeout(function () { clearBoard(); }, 4000)
    }
    console.log("win ===", win)
    console.log("turn====================================", turn)
    return win;
}
function isDraw(numOfKingsMoveWithoutKill) {
    if (numOfKingsMoveWithoutKill > 15) {
        alert("DRAW: GAME OVER")
    }
}


// function isThereAForcedKillForThisChecker(checker) {

//     console.log(numOfKillInThisTurn, " =======numOfKillInThisTurn")
//     anotherdKillForThisTurn = false;
//     var allCheckers = checkers;

//     console.log("checker.color!!!!!", checker.color)
//     for (var j = 0; j < allCheckers.length; j++) {
//         if (allCheckers[j].color != turn) {
//             console.log("ppppppppppp", allCheckers[j])
//             var opponentChecker = allCheckers[j];

//             if (checker.color == "white" || checker.isKing || numOfKillInThisTurn > 0) {
//                 console.log("in function isThereAForcedKillForThisChecker")
//                 var emptyCell = document.getElementById("cell-" + (checker.row + 2) + "-" + (checker.cell + 2));
//                 if (((checker.row + 1 == opponentChecker.row) && (checker.cell + 1 == opponentChecker.cell)) &&
//                     (emptyCell != null && emptyCell.children.length <= 0)) {
//                     var checkerDiv = document.getElementById("cell-" + (checker.row) + "-" + (checker.cell)).firstChild;
//                     checkerDiv.classList.add("ready-to-kill");
//                     // checkerDiv.classList.add("selected");
//                     console.log("There is A Forced Kill on row" + checker.row + " " + checker.cell)
//                     anotherdKillForThisTurn = true;
//                 }
//                 emptyCell = document.getElementById("cell-" + (checker.row + 2) + "-" + (checker.cell - 2));
//                 if (((checker.row + 1 == opponentChecker.row) && (checker.cell - 1 == opponentChecker.cell)) &&
//                     (emptyCell != null && emptyCell.children.length <= 0)) {
//                     var checkerDiv = document.getElementById("cell-" + (checker.row) + "-" + (checker.cell)).firstChild;
//                     checkerDiv.classList.add("ready-to-kill");
//                     console.log("There is A Forced Kill on row" + checker.row + " " + checker.cell)
//                     anotherdKillForThisTurn = true;
//                 }
//             }

//             if (checker.color == "black" || checker.isKing || numOfKillInThisTurn > 0) {
//                 console.log("There is A Forced Kill on row" + checker.row + " " + checker.cell)

//                 var emptyCell = document.getElementById("cell-" + (checker.row - 2) + "-" + (checker.cell + 2));
//                 if (((checker.row - 1 == opponentChecker.row) && (checker.cell + 1 == opponentChecker.cell)) &&
//                     (emptyCell != null && emptyCell.children.length <= 0)) {
//                     var checkerDiv = document.getElementById("cell-" + (checker.row) + "-" + (checker.cell)).firstChild;
//                     checkerDiv.classList.add("ready-to-kill");
//                     console.log("There is A Forced Kill on row" + checker.row + " " + checker.cell)
//                     anotherdKillForThisTurn = true;
//                 }
//                 emptyCell = document.getElementById("cell-" + (checker.row - 2) + "-" + (checker.cell - 2));
//                 if (((checker.row - 1 == opponentChecker.row) && (checker.cell - 1 == opponentChecker.cell)) &&
//                     (emptyCell != null && emptyCell.children.length <= 0)) {
//                     var checkerDiv = document.getElementById("cell-" + (checker.row) + "-" + (checker.cell)).firstChild;
//                     checkerDiv.classList.add("ready-to-kill");
//                     console.log("There is A Forced Kill on row" + checker.row + " " + checker.cell)
//                     anotherdKillForThisTurn = true;
//                 }
//             }
//         }
//     }
//     return anotherdKillForThisTurn;
// }

