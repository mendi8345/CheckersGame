var selectedChecker = undefined;
var positionOfOpponentCheckerToKill = undefined;
var turn = "white";

var checkers = [
    { row: 1, cell: 2, color: 'white', isKing: false },
    { row: 1, cell: 4, color: 'white', isKing: false },
    { row: 1, cell: 6, color: 'white', isKing: false },
    { row: 1, cell: 8, color: 'white', isKing: false },
    { row: 2, cell: 1, color: 'white', isKing: false },
    { row: 2, cell: 3, color: 'white', isKing: false },
    { row: 2, cell: 5, color: 'white', isKing: false },
    { row: 2, cell: 7, color: 'white', isKing: false },
    { row: 3, cell: 2, color: 'white', isKing: false },
    { row: 3, cell: 4, color: 'white', isKing: false },
    { row: 3, cell: 6, color: 'white', isKing: false },
    { row: 3, cell: 8, color: 'white', isKing: false },



    { row: 6, cell: 1, color: 'black', isKing: false },
    { row: 6, cell: 3, color: 'black', isKing: false },
    { row: 6, cell: 5, color: 'black', isKing: false },
    { row: 6, cell: 7, color: 'black', isKing: false },
    { row: 7, cell: 2, color: 'black', isKing: false },
    { row: 7, cell: 4, color: 'black', isKing: false },
    { row: 7, cell: 6, color: 'black', isKing: false },
    { row: 7, cell: 8, color: 'black', isKing: false },
    { row: 8, cell: 1, color: 'black', isKing: false },
    { row: 8, cell: 3, color: 'black', isKing: false },
    { row: 8, cell: 5, color: 'black', isKing: false },
    { row: 8, cell: 7, color: 'black', isKing: false },

];

var isFirstBoardSet = true;
function renderCheckers() {
    console.log('rendering checkers', checkers);
    clearBoard(isFirstBoardSet);
    for (var i = 0; i < checkers.length; i++) {
        var checker = checkers[i];
        var cell = document.getElementById("cell-" + checker.row + '-' + checker.cell);
        cell.appendChild(renderChecker(i, checker.color));
    }

    isThereAWin(checkers, turn)
    isFirstBoardSet = false;
}


function renderChecker(i, color) {
    var checker = document.createElement("div");
    checker.id = "checker-" + i;
    checker.className = "checker " + color + "-checker";
    checker.checerPosition = i;
    checker.draggable = "true";
    var crownImg = document.createElement("i");


    if (checkers[i].isKing) {
        crownImg.className = "fas fa-crown";
        checker.appendChild(crownImg);
    }
    isforcedKillOnBoardNextTurn = isForcedKillOnBoard;
    checker.addEventListener("dragstart", selectChecker);
    checker.addEventListener("drag", selectChecker);
    checker.addEventListener("click", selectChecker);

    console.log("****************************** ", typeof (checker));
    isForcedKillOnBoard = false;
    return checker;
}



function selectChecker(event) {
    priviosSelectedChecker = document.getElementsByClassName("selected")[0];
    console.log("anotherdKillForThisTurn ==", anotherdKillForThisTurn);
    if (priviosSelectedChecker != undefined && (!(anotherdKillForThisTurn))) {
        priviosSelectedChecker.classList.remove("selected");
    }
    var checkerIndex = this.checerPosition;
    if (checkers[checkerIndex].color == turn && this.classList.contains("ready-to-kill")) {
        console.log("checkerIndex == ", this.checerPosition);
        selectedChecker = checkers[checkerIndex];
        this.classList.add("selected");
        event.dataTransfer.setData("text", event.target.id);
        madeCellResponsive();
    }
    else if ((!(isforcedKillOnBoardNextTurn || anotherdKillForThisTurn)) && (checkers[checkerIndex].color == turn)) {
        selectedChecker = checkers[checkerIndex];
        console.log(`Finished selecting checker: `, selectedChecker)
        this.classList.add("selected");
        event.dataTransfer.setData("text", event.target.id);
        madeCellResponsive();

    }
}



function isALegalMove(checker, blackCell) {
    var isLegalMove = false;
    var id = blackCell.id;
    var idParts = id.split('-')
    checkerRow = checker.row;
    checkerCell = checker.cell;

    cellRow = Number(idParts[1])
    cellColumn = Number(idParts[2])

    if (blackCell.children.length <= 0) {

        if (checker.color == "black" || checker.isKing || numOfKillInThisTurn > 0) {
            if ((!(isForcedKillOnBoard)) && (cellRow == checkerRow - 1) && (cellColumn == checkerCell + 1 || cellColumn == checkerCell - 1)) {
                isLegalMove = true;
            }
            if ((cellRow == checkerRow - 2) && (cellColumn == checkerCell + 2)) {
                var skipCell = document.getElementById("cell-" + (checker.row - 1) + "-" + (checker.cell + 1));
                if (skipCell.children.length > 0 && !(skipCell.classList.contains("black-checker"))) {
                    for (var index = 0; index < checkers.length; index++) {
                        var c = checkers[index];
                        if (c.row == checker.row - 1 && c.cell == checker.cell + 1 && c.color != checker.color) {
                            positionOfOpponentCheckerToKill = index;
                            isLegalMove = true;

                            break;
                        }
                    }
                }
            }
            if ((cellRow == checkerRow - 2) && (cellColumn == checkerCell - 2)) {
                var skipCell = document.getElementById("cell-" + (checker.row - 1) + "-" + (checker.cell - 1));
                if (skipCell.children.length > 0 && !(skipCell.classList.contains("black-checker"))) {
                    for (var index = 0; index < checkers.length; index++) {
                        var c = checkers[index];
                        if (c.row == checker.row - 1 && c.cell == checker.cell - 1 && c.color != checker.color) {
                            positionOfOpponentCheckerToKill = index;
                            isLegalMove = true;
                            break;
                        }
                    }
                }
            }
        }

        if (checker.color == "white" || checker.isKing || numOfKillInThisTurn > 0) {
            console.log("2")
            if ((!(isForcedKillOnBoard)) && (cellRow == checkerRow + 1) && (cellColumn == checkerCell + 1 || cellColumn == checkerCell - 1)) {
                console.log("3", checker.color, " ", cellRow, " ", checkerRow)
                console.log(checker.color == "white")
                console.log(numOfKillInThisTurn > 0)
                console.log(checker.isKing)
                isLegalMove = true;
            }
            if ((cellRow == checkerRow + 2) && (cellColumn == checkerCell + 2)) {
                var skipCell = document.getElementById("cell-" + (checker.row + 1) + "-" + (checker.cell + 1));
                if (skipCell.children.length > 0 && !(skipCell.classList.contains("white-checker"))) {
                    for (var index = 0; index < checkers.length; index++) {
                        var c = checkers[index];
                        if (c.row == checker.row + 1 && c.cell == checker.cell + 1 && c.color != checker.color) {
                            positionOfOpponentCheckerToKill = index;
                            isLegalMove = true;
                            break;
                        }
                    }
                }

            }
            if ((cellRow == checkerRow + 2) && (cellColumn == checkerCell - 2)) {
                var skipCell = document.getElementById("cell-" + (checker.row + 1) + "-" + (checker.cell - 1));
                if (skipCell.children.length > 0 && !(skipCell.classList.contains("white-checker"))) {
                    for (var index = 0; index < checkers.length; index++) {
                        var c = checkers[index];
                        if (c.row == checker.row + 1 && c.cell == checker.cell - 1 && c.color != checker.color) {
                            positionOfOpponentCheckerToKill = index;
                            isLegalMove = true;
                            break;
                        }
                    }

                }

            }
        }
    }
    console.log(`isLegalMove == `, isLegalMove)
    return isLegalMove;
}


function madeCellResponsive() {
    var blackCells = document.getElementsByClassName("cell black");
    console.log(blackCells.length);
    for (var i = 0; i < blackCells.length; i++) {
        var cell = blackCells[i];
        if (cell.children.length <= 0) {
            var allCheckersDivs = document.getElementsByClassName("selected")
            if (allCheckersDivs.length > 0) {
                cell.addEventListener("dragover", allowDrop);
                cell.addEventListener("drop", moveSelectedCheckerHere);

            }
        }
    }
}
function allowDrop(event) {
    event.preventDefault();
}
