import { UCIMove } from "../types/responses";


export class ChessGameTree {
    //should be a tree kind of structure

}

export class ChessGame {
    positions: Position | null = null
    moves: string[][] = []
    moveIndex: number = -1
    constructor(startingPosition: Position | null) {
        this.positions = startingPosition
    }

    static convertToUciMoves(game: ChessGame): string[] {
        const uciMoves: string[] = [];

        let currentPosition = game.positions;

        while (currentPosition?.next[0]) {
            const nextPosition = currentPosition.next[0];

            const from = nextPosition.move?.from;
            const to = nextPosition.move?.to;

            let uciMove = `${from}${to}`;

            // Promotion in UCI:
            // e7e8q, e7e8r, e7e8b, e7e8n
            if (nextPosition.move?.promotion) {
                uciMove += nextPosition.move?.promotion.toLowerCase();
            }

            uciMoves.push(uciMove);

            currentPosition = nextPosition;
        }

        return uciMoves;
    }

    static movesToPgn(moves: string[]) {
        let result: string = ""
        for (let i = 0; i < moves.length; i += 2) {
            result += `${i / 2 + 1}. ${moves[i]} `

            if (i + 1 < moves.length) {
                result += `${moves[i + 1]} `
            }

        }

        return result;
    }

}
//test
export class Position {
    //linked list of chess boards to display, also makes it easier to pass
    //to Stockfish later on
    //we will migrate to positions instead of chess board to make it easier
    //can only have sublines in analysis so we need different modes for the board
    isMainLine: boolean = false
    position: (ChessBoardModel | null) = null
    //next is an array due to possibility of sublines
    next: Position[] = []
    prev: (Position | null) = null
    movePlayed: string | null = null
    moveIndex: number = 0
    move: UCIMove | null = null
    constructor(position: ChessBoardModel | null, next: Position[], prev: Position | null) {
        this.position = position
        this.next = next
        this.prev = prev
    }
    //test
}
export class ChessSquareModel {
    chessPiece: (Pawn | Rook | King | Queen | Knight | Bishop | null) = null
    isPossibleMove: boolean = false
    isSquareAttackedByWhite: boolean = false
    isSquareAttackedByBlack: boolean = false
    isChecked: boolean = false
    isPromoting: boolean = false
    static whitePromotionRow = 0
    static blackPromotionRow = 7
    constructor(chessPiece: (Pawn | Rook | King | Queen | Knight | Bishop | null), isPossibleMove: boolean, isSquareAttackedByWhite: boolean, isSquareAttackedByBlack: boolean, isChecked: boolean) {
        this.chessPiece = chessPiece
        this.isPossibleMove = isPossibleMove
        this.isSquareAttackedByWhite = isSquareAttackedByWhite
        this.isSquareAttackedByBlack = isSquareAttackedByBlack
        this.isChecked = isChecked
    }


    copy() {
        if (this.chessPiece != null) {
            return new ChessSquareModel(this.chessPiece.copy(), this.isPossibleMove, this.isSquareAttackedByBlack, this.isSquareAttackedByBlack, this.isChecked)
        }
        return new ChessSquareModel(null, this.isPossibleMove, this.isSquareAttackedByBlack, this.isSquareAttackedByBlack, this.isChecked)

    }
}
export class ChessBoardModel {
    whosMove: ("white" | "black") = "white"
    board: (ChessSquareModel)[][] = []
    isChecking: boolean = false
    previouslyMovedPieceSquare: number[] = []
    movingPiece: number[] = []
    possibleMoves: number[][] = []
    promotingPiece: "knight" | "bishop" | "rook" | "queen" | null = null
    constructor() {

    }

    initBoard() {
        let whiteRook1 = new Rook(7, 0, "white", false)
        let whiteRook2 = new Rook(7, 7, "white", false)
        let whiteKnight1 = new Knight(7, 1, "white", false)
        let whiteKnight2 = new Knight(7, 6, "white", false)
        let whiteBishop1 = new Bishop(7, 2, "white", false)
        let whiteBishop2 = new Bishop(7, 5, "white", false)
        let whiteQueen = new Queen(7, 3, "white", false)
        let whiteKing = new King(7, 4, "white", false)

        let blackRook1 = new Rook(0, 0, "black", false)
        let blackRook2 = new Rook(0, 7, "black", false)
        let blackKnight1 = new Knight(0, 1, "black", false)
        let blackKnight2 = new Knight(0, 6, "black", false)
        let blackBishop1 = new Bishop(0, 2, "black", false)
        let blackBishop2 = new Bishop(0, 5, "black", false)
        let blackQueen = new Queen(0, 3, "black", false)
        let blackKing = new King(0, 4, "black", false)

        let whitePawns = []
        let blackPawns = []

        for (let i = 0; i < 8; i++) {
            whitePawns[i] = new Pawn(6, i, "white", false)
            blackPawns[i] = new Pawn(1, i, "black", false)
        }



        this.board = [


            [
                new ChessSquareModel(blackRook1, false, false, false, false),
                new ChessSquareModel(blackKnight1, false, false, true, false),
                new ChessSquareModel(blackBishop1, false, false, true, false),
                new ChessSquareModel(blackQueen, false, false, true, false),
                new ChessSquareModel(blackKing, false, false, true, false),
                new ChessSquareModel(blackBishop2, false, false, true, false),
                new ChessSquareModel(blackKnight2, false, false, true, false),
                new ChessSquareModel(blackRook2, false, false, false, false)
            ],

            [
                new ChessSquareModel(blackPawns[0], false, false, true, false),
                new ChessSquareModel(blackPawns[1], false, false, true, false),
                new ChessSquareModel(blackPawns[2], false, false, true, false),
                new ChessSquareModel(blackPawns[3], false, false, true, false),
                new ChessSquareModel(blackPawns[4], false, false, true, false),
                new ChessSquareModel(blackPawns[5], false, false, true, false),
                new ChessSquareModel(blackPawns[6], false, false, true, false),
                new ChessSquareModel(blackPawns[7], false, false, true, false)
            ],

            [
                new ChessSquareModel(null, false, false, true, false),
                new ChessSquareModel(null, false, false, true, false),
                new ChessSquareModel(null, false, false, true, false),
                new ChessSquareModel(null, false, false, true, false),
                new ChessSquareModel(null, false, false, true, false),
                new ChessSquareModel(null, false, false, true, false),
                new ChessSquareModel(null, false, false, true, false),
                new ChessSquareModel(null, false, false, true, false)
            ],

            [
                new ChessSquareModel(null, false, false, false, false),
                new ChessSquareModel(null, false, false, false, false),
                new ChessSquareModel(null, false, false, false, false),
                new ChessSquareModel(null, false, false, false, false),
                new ChessSquareModel(null, false, false, false, false),
                new ChessSquareModel(null, false, false, false, false),
                new ChessSquareModel(null, false, false, false, false),
                new ChessSquareModel(null, false, false, false, false)
            ],

            [
                new ChessSquareModel(null, false, false, false, false),
                new ChessSquareModel(null, false, false, false, false),
                new ChessSquareModel(null, false, false, false, false),
                new ChessSquareModel(null, false, false, false, false),
                new ChessSquareModel(null, false, false, false, false),
                new ChessSquareModel(null, false, false, false, false),
                new ChessSquareModel(null, false, false, false, false),
                new ChessSquareModel(null, false, false, false, false)
            ],
            [
                new ChessSquareModel(null, false, true, false, false),
                new ChessSquareModel(null, false, true, false, false),
                new ChessSquareModel(null, false, true, false, false),
                new ChessSquareModel(null, false, true, false, false),
                new ChessSquareModel(null, false, true, false, false),
                new ChessSquareModel(null, false, true, false, false),
                new ChessSquareModel(null, false, true, false, false),
                new ChessSquareModel(null, false, true, false, false)
            ],

            [
                new ChessSquareModel(whitePawns[0], false, true, false, false),
                new ChessSquareModel(whitePawns[1], false, true, false, false),
                new ChessSquareModel(whitePawns[2], false, true, false, false),
                new ChessSquareModel(whitePawns[3], false, true, false, false),
                new ChessSquareModel(whitePawns[4], false, true, false, false),
                new ChessSquareModel(whitePawns[5], false, true, false, false),
                new ChessSquareModel(whitePawns[6], false, true, false, false),
                new ChessSquareModel(whitePawns[7], false, true, false, false)
            ],

            [
                new ChessSquareModel(whiteRook1, false, false, false, false),
                new ChessSquareModel(whiteKnight1, false, true, false, false),
                new ChessSquareModel(whiteBishop1, false, true, false, false),
                new ChessSquareModel(whiteQueen, false, true, false, false),
                new ChessSquareModel(whiteKing, false, true, false, false),
                new ChessSquareModel(whiteBishop2, false, true, false, false),
                new ChessSquareModel(whiteKnight2, false, true, false, false),
                new ChessSquareModel(whiteRook2, false, false, false, false)
            ],
        ]
    }

    static checkIfIsInBounds(row: number, col: number) {
        if (row <= 7 && row >= 0 && col <= 7 && col >= 0) {
            return true;
        }

        return false;

    }

    getPiece(row: number, col: number) {
        if (!ChessBoardModel.checkIfIsInBounds(row, col)) {
            return null;
        }

        return this.board[row][col];
    }

    isThePreviouslyMovedPiece(row: number, col: number) {
        if (this.previouslyMovedPieceSquare.length == 0) {
            return false;
        }

        return this.previouslyMovedPieceSquare[0] == row && this.previouslyMovedPieceSquare[1] == col
    }

    movePiece(rowFrom: number, colFrom: number, rowTo: number, colTo: number, promoteTo: "queen" | "knight" | "bishop" | "rook" | null = null) {
        //if en passant happens what do we do
        const movingPiece = this.board[rowFrom][colFrom].chessPiece
        if (movingPiece == null) {
            return;
        }
        if (movingPiece?.type == 'pawn' && colFrom != colTo && this.board[rowTo][colTo].chessPiece === null && promoteTo == null
        ) {
            //capture the pawn it just skipped
            this.board[rowFrom][colTo].chessPiece = null

        }
        if (promoteTo != null) {
            let promotionPiece = null
            switch (promoteTo) {
                case "bishop": {
                    promotionPiece = new Bishop(rowFrom, colFrom, movingPiece?.color, true)
                    break;
                }
                case "knight": {
                    promotionPiece = new Knight(rowFrom, colFrom, movingPiece?.color, true)
                    break;
                }
                case "rook": {
                    promotionPiece = new Rook(rowFrom, colFrom, movingPiece?.color, true)
                    break;
                }
                default: {
                    promotionPiece = new Queen(rowFrom, colFrom, movingPiece?.color, true)
                }
            }

            this.board[rowTo][colTo].chessPiece = promotionPiece

        } else {
            this.board[rowTo][colTo].chessPiece = movingPiece
        }
        if (this.board[rowTo][colTo].chessPiece != null) {
            this.board[rowTo][colTo].chessPiece.hasMoved = true
            //make sure piece is tracking its new position

            this.board[rowTo][colTo].chessPiece.row = rowTo
            this.board[rowTo][colTo].chessPiece.col = colTo

            //if it is castling
            if (movingPiece?.type == "king") {
                //if king side castles
                if (colFrom == 4 && colTo == this.board[0].length - 2) {
                    this.movePiece(rowFrom, this.board[0].length - 1, rowFrom, colTo - 1)
                }
                //if queen side castles
                if (colFrom == 4 && colTo == 2) {
                    this.movePiece(rowFrom, 0, rowFrom, colTo + 1)
                }
            }
        }

        //if it castles 

        //handle promotion if it is a pawn and reaches the end we promote to some 
        //other piece

        this.board[rowFrom][colFrom].chessPiece = null
    }

    clearPossibleMoves() {
        for (let i = 0; i < this.board.length; i++) {
            for (let j = 0; j < this.board[0].length; j++) {
                this.board[i][j].isPossibleMove = false
                this.board[i][j].isPromoting = false
            }
        }
    }

    recomputeAttackedSquares() {

        // RESET
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                this.board[i][j].isSquareAttackedByWhite = false
                this.board[i][j].isSquareAttackedByBlack = false
                this.board[i][j].isChecked = false
                this.board[i][j].isChecked = false
            }
        }
        for (let i = 0; i < this.board.length; i++) {
            for (let j = 0; j < this.board[0].length; j++) {
                if (this.board[i][j].chessPiece != null) {
                    //pass this current instance for the board for movement array
                    //ideal since board handles its own behaviour (encapsulation)
                    if (this.board[i][j].chessPiece?.type != "pawn") {
                        this.board[i][j].chessPiece?.getMovementArr(this)

                        let movementArr = this.board[i][j].chessPiece?.movementArr
                        if (movementArr == undefined) {
                            continue
                        }
                        for (let k = 0; k < movementArr?.length; k++) {
                            if (this.board[i][j].chessPiece?.color == 'white') {
                                this.board[movementArr[k][0]][movementArr[k][1]].isSquareAttackedByWhite = true

                                if (this.board[movementArr[k][0]][movementArr[k][1]].chessPiece != null && this.board[movementArr[k][0]][movementArr[k][1]].chessPiece?.color == 'black' && this.board[movementArr[k][0]][movementArr[k][1]].chessPiece?.type == 'king') {
                                    this.board[movementArr[k][0]][movementArr[k][1]].isChecked = true
                                    this.isChecking = true
                                }
                            } else {
                                this.board[movementArr[k][0]][movementArr[k][1]].isSquareAttackedByBlack = true
                                if (this.board[movementArr[k][0]][movementArr[k][1]].chessPiece != null && this.board[movementArr[k][0]][movementArr[k][1]].chessPiece?.color == 'white' && this.board[movementArr[k][0]][movementArr[k][1]].chessPiece?.type == 'king') {
                                    this.board[movementArr[k][0]][movementArr[k][1]].isChecked = true
                                    this.isChecking = true
                                }

                            }
                        }
                    } else {
                        const pawn = this.board[i][j].chessPiece

                        if (pawn == null) {
                            continue
                        }

                        // White moves upward (-1), black moves downward (+1)
                        const rowIncrement = pawn.color === "white" ? -1 : 1

                        const attackedRow = i + rowIncrement

                        // Pawn attacks diagonally left and right
                        const attackedCols = [j - 1, j + 1]

                        for (const attackedCol of attackedCols) {

                            if (
                                !ChessBoardModel.checkIfIsInBounds(
                                    attackedRow,
                                    attackedCol
                                )
                            ) {
                                continue
                            }

                            const attackedSquare =
                                this.board[attackedRow][attackedCol]

                            if (pawn.color === "white") {
                                attackedSquare.isSquareAttackedByWhite = true

                                // Check black king
                                if (
                                    attackedSquare.chessPiece?.type === "king" &&
                                    attackedSquare.chessPiece.color === "black"
                                ) {
                                    attackedSquare.isChecked = true
                                    this.isChecking = true
                                }
                                //
                            } else {
                                attackedSquare.isSquareAttackedByBlack = true

                                // Check white king
                                if (
                                    attackedSquare.chessPiece?.type === "king" &&
                                    attackedSquare.chessPiece.color === "white"
                                ) {
                                    this.isChecking = true
                                    attackedSquare.isChecked = true
                                }
                            }
                        }
                    }
                    //
                }
            }
        }
    }

    static copyModel(from: ChessBoardModel, to: ChessBoardModel) {
        let boardFrom = from.board
        let boardTo = to.board

        for (let i = 0; i < boardFrom.length; i++) {
            for (let j = 0; j < boardFrom[0].length; j++) {
                if (boardFrom[i][j] != null) {
                    boardTo[i][j] = boardFrom[i][j].copy()
                }
            }
        }

        //copy all the parameters
        to.whosMove = from.whosMove
        to.isChecking = from.isChecking
        to.previouslyMovedPieceSquare = from.previouslyMovedPieceSquare
        to.movingPiece = from.movingPiece
        to.possibleMoves = from.possibleMoves



    }

    static getNotation(board: ChessBoardModel, movedPiece: (Pawn | Rook | King | Queen | Knight | Bishop | null), from: number[], to: number[], hasCaptured: boolean, promoteTo: "knight" | "bishop" | "rook" | "queen" | null = null) {

        //deal with castle notation

        let notation = ""
        //get abbreviation for piece
        switch (movedPiece?.type) {
            case "knight": {
                notation += "N"
                //check if another knight can reach it
                let others = Knight.withinCaptureReach(board, to[0], to[1], null, movedPiece?.color)

                notation += this.getRowColNotationAppendice(others, from[0], from[1])
                break
            }

            case "bishop": {
                notation += "B"
                let others = Bishop.withinCaptureReach(board, to[0], to[1], null, movedPiece?.color)
                notation += this.getRowColNotationAppendice(others, from[0], from[1])

                //check if another bishop can reach it
                break
            }

            case "rook": {
                notation += "R"
                let others = Rook.withinCaptureReach(board, to[0], to[1], null, movedPiece?.color)
                notation += this.getRowColNotationAppendice(others, from[0], from[1])

                //check if another rook can reach it
                break
            }

            case "queen": {
                notation += "Q"
                let others = Queen.withinCaptureReach(board, to[0], to[1], null, movedPiece?.color)
                notation += this.getRowColNotationAppendice(others, from[0], from[1])

                //check if another queen can reach it
                break
            }

            case "king": {
                //king side castling
                if (from[1] == 4 && to[1] == board.board[0].length - 2) {
                    return "0-0"
                }
                if (from[1] == 4 && to[1] == 2) {
                    return "0-0-0"
                }
                notation += "K"
                let others = King.withinCaptureReach(board, to[0], to[1], null, movedPiece?.color)
                notation += this.getRowColNotationAppendice(others, from[0], from[1])

                break
            }

        }

        //add a section to append if the square the piece moved from is relevant
        if (hasCaptured) {
            if (movedPiece?.type == 'pawn') {
                notation += String.fromCharCode('a'.charCodeAt(0) + from[1])

            }
            notation += "x"
        }



        console.log("Piece row, col" + `${to[0]}, ${to[1]}`)
        notation += String.fromCharCode('a'.charCodeAt(0) + to[1])
        notation += 8 - to[0]
        if (promoteTo != null && movedPiece?.type == "pawn") {
            let promoteTypePrefix = ""
            switch (promoteTo) {
                case "knight": {
                    promoteTypePrefix = "N"
                    break;
                }
                case "bishop": {
                    promoteTypePrefix = "B"
                    break;
                }
                case "rook": {
                    promoteTypePrefix = "R"
                    break;
                }
                default: {
                    promoteTypePrefix = "Q"
                }

            }
            notation += `=${promoteTypePrefix}`
        }
        return notation
    }

    static getRowColNotationAppendice(others: number[][], row: number, col: number) {
        let useColumn = false
        let useRow = false
        for (let i = 0; i < others.length; i++) {
            let curr = others[i]
            //dont want to count current piece as something different
            if (curr[0] == row && curr[1] == col) {
                continue;
            }


            if (curr[1] != col) {
                useColumn = true

            }
            if (curr[1] == col) {
                useRow = true
            }


        }

        let result = ""
        if (useColumn) {
            //append the column
            result += String.fromCharCode('a'.charCodeAt(0) + col);
        }

        if (useRow) {
            result += 8 - row
        }

        return result;
    }

    static getRowColFromString(move: string): number[] {
        let col = move.charAt(0)
        let row = move.charAt(1)


        let colNumber = this.getColFromString(col)
        let rowNumber = this.getRowFromString(row)


        return [rowNumber, colNumber]
    }

    static getRowFromString(row: string) {
        return 8 - parseInt(row)
    }

    static getColFromString(col: string) {
        return 0 - 'a'.charCodeAt(0) + col.charCodeAt(0)
    }

    static indiceToUciMoveString(index: number[]) {
        const row = index[0]
        const col = index[1]

        const rank = 8 - row
        const colString = String.fromCharCode('a'.charCodeAt(0) + col)

        return `${colString}${rank}`
    }

    static promotionUci(piece: "queen" | "knight" | "bishop" | "rook") {
        switch (piece) {
            case "knight": {
                return 'n'
            }
            case "bishop": {
                return 'b'
            }
            case "rook": {
                return 'r'
            }

            default: {
                return 'q'
            }
        }
    }






}

export class ChessPiece {
    row = 0
    col = 0
    color = "white"
    hasMoved = false
    type: "pawn" | "knight" | "rook" | "queen" | "king" | "bishop" | "" = ""
    previousPosition: number[] = []
    constructor(row: number, col: number, color: string, hasMoved: boolean, type: "pawn" | "knight" | "rook" | "queen" | "king" | "bishop" | "") {
        this.row = row
        this.col = col
        this.color = color
        this.hasMoved = hasMoved
        this.type = type

    }
    getRow() {
        return this.row;
    }

    getCol() {
        return this.col
    }
    getHasMoved() {
        return this.hasMoved;
    }
    getMovementArr(board: ChessBoardModel) {

    }

    copy() {

    }

    getMovementNotation() {

    }



}
export class Pawn extends ChessPiece {

    movementArr: number[][] = []
    whiteMovementArr = [[-1, 0], [-2, 0]]
    blackMovementArr = [[1, 0], [2, 0]]
    usedMovementArr: number[][] = []
    //follows move To and taken piece
    enpassantArr: number[][] = []
    constructor(row: number, col: number, color: string, hasMoved: boolean) {
        super(row, col, color, hasMoved, "pawn")
        if (color == 'white') {
            this.usedMovementArr = this.whiteMovementArr
        } else {
            this.usedMovementArr = this.blackMovementArr
        }
    }


    //to implement
    //if moves to backrank then promotion is applied
    //need to delete reference in board array and make new 
    //Piece object depending on what user promotes to
    getMovementArr(board: ChessBoardModel) {



        //reset movementArray
        this.movementArr = []
        //deal with regular moves
        let chessBoard = board.board
        if (chessBoard == null) {
            return;
        }

        let rowCheck = this.row + this.usedMovementArr[0][0]
        if (ChessBoardModel.checkIfIsInBounds(rowCheck, this.col)) {
            if (chessBoard[rowCheck][this.col].chessPiece == null) {
                this.movementArr.push([rowCheck, this.col])
                rowCheck = this.row + this.usedMovementArr[1][0]
                if (!this.hasMoved && ChessBoardModel.checkIfIsInBounds(rowCheck, this.col) && chessBoard[rowCheck][this.col].chessPiece == null) {
                    this.movementArr.push([rowCheck, this.col])
                }
            }
        }


        //this checks en passant
        this.checkEnPassant(board, 1);
        this.checkEnPassant(board, -1);

        //this checks captures

        this.checkCaptures(board, this.usedMovementArr[0][0], 1);
        this.checkCaptures(board, this.usedMovementArr[0][0], -1);



    }


    doesMovePromote(rowMovement: number) {
        if (this.color == 'white') {
            return this.row + rowMovement == 0
        }

        return this.row + rowMovement == 7
    }

    checkEnPassant(board: ChessBoardModel, colIncrement: number) {
        //check en-passant
        let rowCheck = this.row + this.usedMovementArr[0][0]
        let colCheck = this.col + colIncrement
        let rowBoundary = this.color == 'white' ? 3 : 4
        let otherColorStart = this.color == 'white' ? 1 : 6
        let chessBoard = board.board

        if (!ChessBoardModel.checkIfIsInBounds(rowCheck, colCheck)) {
            return;
        }

        if (board.board[this.row][colCheck]?.chessPiece == null || board.board[this.row][colCheck]?.chessPiece?.color == this.color) {
            return;
        }
        if (this.row == rowBoundary && board.board[this.row][colCheck]?.chessPiece?.type == 'pawn' && board.previouslyMovedPieceSquare[0] == this.row && board.previouslyMovedPieceSquare[1] == colCheck) {
            this.movementArr.push([rowCheck, colCheck, this.row, colCheck])
        }
    }

    checkCaptures(board: ChessBoardModel, rowIncrement: number, colIncrement: number) {
        let checkRow = this.row + rowIncrement
        let checkCol = this.col + colIncrement

        let chessBoard = board.board
        if (ChessBoardModel.checkIfIsInBounds(checkRow, checkCol) && chessBoard[checkRow][checkCol].chessPiece != null && chessBoard[checkRow][checkCol]?.chessPiece?.color != this.color) {
            if (chessBoard[checkRow][checkCol]?.chessPiece?.type == "king") {
                board.isChecking = true
            } else {
                this.movementArr.push([checkRow, checkCol])
            }
        }

    }

    getMovementNotation() {

    }
    copy() {
        let newPawn = new Pawn(this.row, this.col, this.color, this.hasMoved)

        return newPawn;
    }

    static withinCaptureReach(board: ChessBoardModel, row: number, col: number, proxyType: string | null, color: string) {
        let whitePawnCaptures = [[1, -1], [1, 1]]
        let blackPawnCaptures = [[-1, -1], [-1, 1]]
        let ans: number[][] = []
        let usedCapturedArr = color == 'white' ? whitePawnCaptures : blackPawnCaptures

        for (let i = 0; i < usedCapturedArr.length; i++) {
            let rowMov = usedCapturedArr[i][0]
            let colMov = usedCapturedArr[i][1]

            if (ChessBoardModel.checkIfIsInBounds(rowMov + row, colMov + col) && board.board[row + rowMov][col + colMov].chessPiece != null && board.board[row + rowMov][col + colMov].chessPiece?.type == 'pawn' && board.board[row + rowMov][col + colMov].chessPiece?.color == color) {
                ans.push([rowMov + row, colMov + col])
            }
        }


        return ans;

    }


}


export class Bishop extends ChessPiece {

    movementArr: number[][] = []

    constructor(row: number, col: number, color: string, hasMoved: boolean) {
        super(row, col, color, hasMoved, "bishop")
    }


    //to implement
    getMovementArr(board: ChessBoardModel) {
        //reset movementArray
        this.movementArr = []
        //deal with regular moves
        let chessBoard = board.board
        if (chessBoard == null) {
            return;
        }
        //direction relative to white position
        //check all 4 diagonals
        //check top right diagonal
        let tempRow = this.row - 1
        let tempCol = this.col + 1

        while (ChessBoardModel.checkIfIsInBounds(tempRow, tempCol)) {
            if (board.board[tempRow][tempCol].chessPiece != null && board.board[tempRow][tempCol].chessPiece?.color == this.color) {
                break;
            }
            this.movementArr.push([tempRow, tempCol])

            if (board.board[tempRow][tempCol].chessPiece != null) {
                break;
            }

            tempRow--;
            tempCol++
        }

        //bottom left diagonal
        tempRow = this.row + 1
        tempCol = this.col - 1

        while (ChessBoardModel.checkIfIsInBounds(tempRow, tempCol)) {
            if (board.board[tempRow][tempCol].chessPiece != null && board.board[tempRow][tempCol].chessPiece?.color == this.color) {
                break;
            }
            this.movementArr.push([tempRow, tempCol]);
            if (board.board[tempRow][tempCol].chessPiece != null) {
                break;
            }

            tempRow++;
            tempCol--;
        }

        //top left diagonal
        tempRow = this.row - 1;
        tempCol = this.col - 1;

        while (ChessBoardModel.checkIfIsInBounds(tempRow, tempCol)) {

            if (board.board[tempRow][tempCol].chessPiece != null && board.board[tempRow][tempCol].chessPiece?.color == this.color) {
                break;
            }
            this.movementArr.push([tempRow, tempCol]);
            if (board.board[tempRow][tempCol].chessPiece != null) {
                break;
            }

            tempRow--;
            tempCol--;
        }

        //bottom right diagonal
        tempRow = this.row + 1;
        tempCol = this.col + 1;

        while (ChessBoardModel.checkIfIsInBounds(tempRow, tempCol)) {
            if (board.board[tempRow][tempCol].chessPiece != null && board.board[tempRow][tempCol].chessPiece?.color == this.color) {
                break;
            }
            this.movementArr.push([tempRow, tempCol]);
            if (board.board[tempRow][tempCol].chessPiece != null) {
                break;
            }

            tempRow++;
            tempCol++;
        }



    }

    copy() {
        return new Bishop(this.row, this.col, this.color, this.hasMoved)
    }

    static withinCaptureReach(board: ChessBoardModel, row: number, col: number, proxyType: string | null, color: string) {
        let ans: number[][] = []

        let rowColAdjustments = [[-1, 1], [-1, -1], [1, -1], [1, 1]]
        let type = proxyType == null ? "bishop" : proxyType

        //top right
        for (let i = 0; i < rowColAdjustments.length; i++) {
            let currAdjustment = rowColAdjustments[i]
            let rowAdjusted = row + currAdjustment[0]
            let colAdjusted = col + currAdjustment[1]
            while (ChessBoardModel.checkIfIsInBounds(rowAdjusted, colAdjusted)) {
                if (board.board[rowAdjusted][colAdjusted].chessPiece?.type == type && board.board[rowAdjusted][colAdjusted].chessPiece?.color == color) {
                    ans.push([rowAdjusted, colAdjusted])
                    break;
                }

                if (board.board[rowAdjusted][colAdjusted].chessPiece != null) {
                    break;
                }

                rowAdjusted += currAdjustment[0]
                colAdjusted += currAdjustment[1]
            }
        }

        return ans;



    }

}

export class Rook extends ChessPiece {
    movementArr: number[][] = []

    constructor(row: number, col: number, color: string, hasMoved: boolean) {
        super(row, col, color, hasMoved, "rook")
    }


    //to implement
    getMovementArr(board: ChessBoardModel) {
        //move to the right
        this.movementArr = []
        let chessBoard = board.board
        if (chessBoard == null) {
            return;
        }
        let tempRow = this.row
        let tempCol = this.col + 1
        while (ChessBoardModel.checkIfIsInBounds(tempRow, tempCol)) {
            if (board.board[tempRow][tempCol].chessPiece != null && board.board[tempRow][tempCol].chessPiece?.color == this.color) {
                break;
            }



            this.movementArr.push([tempRow, tempCol])
            if (board.board[tempRow][tempCol].chessPiece != null && board.board[tempRow][tempCol].chessPiece?.color != this.color) {
                break;
            }
            tempCol++;
        }


        //move to the left
        tempRow = this.row
        tempCol = this.col - 1
        while (ChessBoardModel.checkIfIsInBounds(tempRow, tempCol)) {
            if (board.board[tempRow][tempCol].chessPiece != null && board.board[tempRow][tempCol].chessPiece?.color == this.color) {
                break;
            }

            this.movementArr.push([tempRow, tempCol])
            if (board.board[tempRow][tempCol].chessPiece != null && board.board[tempRow][tempCol].chessPiece?.color != this.color) {
                break;
            }
            tempCol--;
        }

        //move up

        tempRow = this.row - 1;
        tempCol = this.col
        while (ChessBoardModel.checkIfIsInBounds(tempRow, tempCol)) {
            if (board.board[tempRow][tempCol].chessPiece != null && board.board[tempRow][tempCol].chessPiece?.color == this.color) {
                break;
            }

            this.movementArr.push([tempRow, tempCol])
            if (board.board[tempRow][tempCol].chessPiece != null && board.board[tempRow][tempCol].chessPiece?.color != this.color) {
                break;
            }
            tempRow--;
        }

        //move down test

        tempRow = this.row + 1;
        tempCol = this.col

        while (ChessBoardModel.checkIfIsInBounds(tempRow, tempCol)) {
            if (board.board[tempRow][tempCol].chessPiece != null && board.board[tempRow][tempCol].chessPiece?.color == this.color) {
                break;
            }

            this.movementArr.push([tempRow, tempCol])
            if (board.board[tempRow][tempCol].chessPiece != null && board.board[tempRow][tempCol].chessPiece?.color != this.color) {
                break;
            }
            tempRow++;
        }



    }

    copy() {
        return new Rook(this.row, this.col, this.color, this.hasMoved)
    }

    //function to check if a knight can reach a certain square
    static withinCaptureReach(board: ChessBoardModel, row: number, col: number, proxyType: string | null, color: string) {
        let ans: number[][] = []

        let rowAdjusted = row
        let colAdjusted = col
        let type = proxyType == null ? "rook" : proxyType

        //check right
        for (let i = col + 1; i < board.board[0].length; i++) {

            if (ChessBoardModel.checkIfIsInBounds(row, i) && board.board[row][i].chessPiece?.type == type && board.board[row][i].chessPiece?.color == color) {
                ans.push([row, i])
                break;
            }

            if (board.board[row][i].chessPiece != null) {
                break;
            }
        }

        //check left
        for (let i = col - 1; i >= 0; i--) {
            if (ChessBoardModel.checkIfIsInBounds(row, i) && board.board[row][i].chessPiece?.type == type && board.board[row][i].chessPiece?.color == color) {
                ans.push([row, i])
                break;
            }

            if (board.board[row][i].chessPiece != null) {
                break;
            }
        }

        //check up
        for (let i = row - 1; i >= 0; i--) {
            if (ChessBoardModel.checkIfIsInBounds(i, col) && board.board[i][col].chessPiece?.type == type && board.board[i][col].chessPiece?.color == color) {
                ans.push([i, col])
                break;
            }
            if (board.board[i][col].chessPiece != null) {
                break;
            }
        }
        //check down
        for (let i = row + 1; i < board.board.length; i++) {
            if (ChessBoardModel.checkIfIsInBounds(i, col) && board.board[i][col].chessPiece?.type == type && board.board[i][col].chessPiece?.color == color) {
                ans.push([i, col])
                break;
            }
            if (board.board[i][col].chessPiece != null) {
                break;
            }
        }

        return ans
    }

}

export class Knight extends ChessPiece {
    movementArr: number[][] = []

    constructor(row: number, col: number, color: string, hasMoved: boolean) {
        super(row, col, color, hasMoved, "knight")
    }

    //test
    //to implement
    getMovementArr(board: ChessBoardModel) {
        //test
        //check top right movements
        this.movementArr = []
        let chessBoard = board.board
        if (chessBoard == null) {
            return;
        }
        let rowAdjusted = this.row - 2
        let colAdjusted = this.col + 1

        if (ChessBoardModel.checkIfIsInBounds(rowAdjusted, colAdjusted) && board.board[rowAdjusted][colAdjusted].chessPiece?.color != this.color) {
            this.movementArr.push([rowAdjusted, colAdjusted])
        }

        rowAdjusted = this.row - 1
        colAdjusted = this.col + 2
        if (ChessBoardModel.checkIfIsInBounds(rowAdjusted, colAdjusted) && board.board[rowAdjusted][colAdjusted].chessPiece?.color != this.color) {
            this.movementArr.push([rowAdjusted, colAdjusted])
        }

        //check top left movements
        rowAdjusted = this.row - 2
        colAdjusted = this.col - 1

        if (ChessBoardModel.checkIfIsInBounds(rowAdjusted, colAdjusted) && board.board[rowAdjusted][colAdjusted].chessPiece?.color != this.color) {
            this.movementArr.push([rowAdjusted, colAdjusted])
        }

        rowAdjusted = this.row - 1
        colAdjusted = this.col - 2

        if (ChessBoardModel.checkIfIsInBounds(rowAdjusted, colAdjusted) && board.board[rowAdjusted][colAdjusted].chessPiece?.color != this.color) {
            this.movementArr.push([rowAdjusted, colAdjusted])
        }
        //check bottom right movements
        rowAdjusted = this.row + 2
        colAdjusted = this.col + 1

        if (ChessBoardModel.checkIfIsInBounds(rowAdjusted, colAdjusted) && board.board[rowAdjusted][colAdjusted].chessPiece?.color != this.color) {
            this.movementArr.push([rowAdjusted, colAdjusted])
        }

        rowAdjusted = this.row + 1
        colAdjusted = this.col + 2

        if (ChessBoardModel.checkIfIsInBounds(rowAdjusted, colAdjusted) && board.board[rowAdjusted][colAdjusted].chessPiece?.color != this.color) {
            this.movementArr.push([rowAdjusted, colAdjusted])
        }

        //check bottom left movements

        rowAdjusted = this.row + 2
        colAdjusted = this.col - 1
        if (ChessBoardModel.checkIfIsInBounds(rowAdjusted, colAdjusted) && board.board[rowAdjusted][colAdjusted].chessPiece?.color != this.color) {
            this.movementArr.push([rowAdjusted, colAdjusted])
        }

        rowAdjusted = this.row + 1
        colAdjusted = this.col - 2
        if (ChessBoardModel.checkIfIsInBounds(rowAdjusted, colAdjusted) && board.board[rowAdjusted][colAdjusted].chessPiece?.color != this.color) {
            this.movementArr.push([rowAdjusted, colAdjusted])
        }

        board.possibleMoves = this.movementArr
    }

    copy() {
        return new Knight(this.row, this.col, this.color, this.hasMoved)
    }

    //function to check if a knight can reach a certain square
    static withinCaptureReach(board: ChessBoardModel, row: number, col: number, proxyType: string | null, color: string) {
        let ans: number[][] = []
        let rowColAdjustments = [[row - 1, col + 2], [row - 2, col + 1], [row - 1, col - 2], [row - 2, col - 1], [row + 1, col - 2], [row + 2, col - 1], [row + 2, col + 1], [row + 1, col + 2]]

        let rowAdjusted = row
        let colAdjusted = col
        let type = proxyType == null ? "knight" : proxyType
        for (let i = 0; i < rowColAdjustments.length; i++) {
            rowAdjusted = rowColAdjustments[i][0]
            colAdjusted = rowColAdjustments[i][1]

            if (ChessBoardModel.checkIfIsInBounds(rowAdjusted, colAdjusted) && board.board[rowAdjusted][colAdjusted].chessPiece?.type == type && board.board[rowAdjusted][colAdjusted].chessPiece?.color == color) {
                ans.push([rowAdjusted, colAdjusted]);
            }
        }

        return ans
    }
}

export class Queen extends ChessPiece {
    movementArr: number[][] = []

    constructor(row: number, col: number, color: string, hasMoved: boolean) {
        super(row, col, color, hasMoved, "queen")
    }


    //to implement
    getMovementArr(board: ChessBoardModel) {
        //instantiate a rook and a bishop
        this.movementArr = []
        let chessBoard = board.board
        if (chessBoard == null) {
            return;
        }
        let dummyRook = new Rook(this.row, this.col, this.color, this.hasMoved)
        let dummyBishop = new Bishop(this.row, this.col, this.color, this.hasMoved)

        dummyRook.getMovementArr(board)
        dummyBishop.getMovementArr(board)

        this.movementArr = [...dummyRook.movementArr, ...dummyBishop.movementArr]

    }

    copy() {
        return new Queen(this.row, this.col, this.color, this.hasMoved)
    }

    //function to check if a knight can reach a certain square
    static withinCaptureReach(board: ChessBoardModel, row: number, col: number, proxyType: string | null, color: string) {

        return [...Bishop.withinCaptureReach(board, row, col, "queen", color), ...Rook.withinCaptureReach(board, row, col, "queen", color)]
    }
}

export class King extends ChessPiece {
    movementArr: number[][] = []

    constructor(row: number, col: number, color: string, hasMoved: boolean) {
        super(row, col, color, hasMoved, "king")
    }


    //to implement
    getMovementArr(board: ChessBoardModel) {
        //king can move in all 8 directions
        //instantiate a rook and a bishop
        this.movementArr = []
        let chessBoard = board.board
        if (chessBoard == null) {
            return;
        }

        //top right corner
        let rowAdjusted = this.row - 1
        let colAdjusted = this.col + 1

        if (ChessBoardModel.checkIfIsInBounds(rowAdjusted, colAdjusted)) {
            let attackedByOpponent = chessBoard[this.row][this.col].chessPiece?.color == 'white' ? chessBoard[rowAdjusted][colAdjusted]?.isSquareAttackedByBlack : chessBoard[rowAdjusted][colAdjusted]?.isSquareAttackedByWhite
            if ((chessBoard[rowAdjusted][colAdjusted].chessPiece == null || chessBoard[rowAdjusted][colAdjusted]?.chessPiece?.color != this.color) && !attackedByOpponent) {

                this.movementArr.push([rowAdjusted, colAdjusted])
            }
        }

        //in front 
        rowAdjusted = this.row - 1
        colAdjusted = this.col
        if (ChessBoardModel.checkIfIsInBounds(rowAdjusted, colAdjusted)) {
            let attackedByOpponent = chessBoard[this.row][this.col].chessPiece?.color == 'white' ? chessBoard[rowAdjusted][colAdjusted]?.isSquareAttackedByBlack : chessBoard[rowAdjusted][colAdjusted]?.isSquareAttackedByWhite
            if ((chessBoard[rowAdjusted][colAdjusted].chessPiece == null || chessBoard[rowAdjusted][colAdjusted]?.chessPiece?.color != this.color) && !attackedByOpponent) {

                this.movementArr.push([rowAdjusted, colAdjusted])
            }
        }
        //top left
        rowAdjusted = this.row - 1
        colAdjusted = this.col - 1
        if (ChessBoardModel.checkIfIsInBounds(rowAdjusted, colAdjusted)) {
            let attackedByOpponent = chessBoard[this.row][this.col].chessPiece?.color == 'white' ? chessBoard[rowAdjusted][colAdjusted]?.isSquareAttackedByBlack : chessBoard[rowAdjusted][colAdjusted]?.isSquareAttackedByWhite
            if ((chessBoard[rowAdjusted][colAdjusted].chessPiece == null || chessBoard[rowAdjusted][colAdjusted]?.chessPiece?.color != this.color) && !attackedByOpponent) {

                this.movementArr.push([rowAdjusted, colAdjusted])
            }
        }
        //to the left
        rowAdjusted = this.row
        colAdjusted = this.col - 1
        if (ChessBoardModel.checkIfIsInBounds(rowAdjusted, colAdjusted)) {
            let attackedByOpponent = chessBoard[this.row][this.col].chessPiece?.color == 'white' ? chessBoard[rowAdjusted][colAdjusted]?.isSquareAttackedByBlack : chessBoard[rowAdjusted][colAdjusted]?.isSquareAttackedByWhite
            if ((chessBoard[rowAdjusted][colAdjusted].chessPiece == null || chessBoard[rowAdjusted][colAdjusted]?.chessPiece?.color != this.color) && !attackedByOpponent) {

                this.movementArr.push([rowAdjusted, colAdjusted])
            }
        }

        //bottom left
        rowAdjusted = this.row + 1
        colAdjusted = this.col - 1
        if (ChessBoardModel.checkIfIsInBounds(rowAdjusted, colAdjusted)) {
            let attackedByOpponent = chessBoard[this.row][this.col].chessPiece?.color == 'white' ? chessBoard[rowAdjusted][colAdjusted]?.isSquareAttackedByBlack : chessBoard[rowAdjusted][colAdjusted]?.isSquareAttackedByWhite
            if ((chessBoard[rowAdjusted][colAdjusted].chessPiece == null || chessBoard[rowAdjusted][colAdjusted]?.chessPiece?.color != this.color) && !attackedByOpponent) {

                this.movementArr.push([rowAdjusted, colAdjusted])
            }
        }

        //bottom
        rowAdjusted = this.row + 1
        colAdjusted = this.col
        if (ChessBoardModel.checkIfIsInBounds(rowAdjusted, colAdjusted)) {
            let attackedByOpponent = chessBoard[this.row][this.col].chessPiece?.color == 'white' ? chessBoard[rowAdjusted][colAdjusted]?.isSquareAttackedByBlack : chessBoard[rowAdjusted][colAdjusted]?.isSquareAttackedByWhite
            if ((chessBoard[rowAdjusted][colAdjusted].chessPiece == null || chessBoard[rowAdjusted][colAdjusted]?.chessPiece?.color != this.color) && !attackedByOpponent) {

                this.movementArr.push([rowAdjusted, colAdjusted])
            }
        }
        //bottom right
        rowAdjusted = this.row + 1
        colAdjusted = this.col + 1
        if (ChessBoardModel.checkIfIsInBounds(rowAdjusted, colAdjusted)) {
            let attackedByOpponent = chessBoard[this.row][this.col].chessPiece?.color == 'white' ? chessBoard[rowAdjusted][colAdjusted]?.isSquareAttackedByBlack : chessBoard[rowAdjusted][colAdjusted]?.isSquareAttackedByWhite
            if ((chessBoard[rowAdjusted][colAdjusted].chessPiece == null || chessBoard[rowAdjusted][colAdjusted]?.chessPiece?.color != this.color) && !attackedByOpponent) {

                this.movementArr.push([rowAdjusted, colAdjusted])
            }
        }

        //right
        rowAdjusted = this.row
        colAdjusted = this.col + 1
        if (ChessBoardModel.checkIfIsInBounds(rowAdjusted, colAdjusted)) {
            let attackedByOpponent = chessBoard[this.row][this.col].chessPiece?.color == 'white' ? chessBoard[rowAdjusted][colAdjusted]?.isSquareAttackedByBlack : chessBoard[rowAdjusted][colAdjusted]?.isSquareAttackedByWhite
            if ((chessBoard[rowAdjusted][colAdjusted].chessPiece == null || chessBoard[rowAdjusted][colAdjusted]?.chessPiece?.color != this.color) && !attackedByOpponent) {

                this.movementArr.push([rowAdjusted, colAdjusted])
            }
        }


        if (!this.hasMoved) {
            //check castling
            let canQueenSideCastle = true
            let canKingSideCastle = true

            //look in both horizontal directions

            //check queenside castling
            let pieceAtLeft = chessBoard[this.row][0].chessPiece

            if (pieceAtLeft?.type == 'rook' && pieceAtLeft?.hasMoved == false && pieceAtLeft?.color == this.color) {
                for (let i = this.col - 1; i >= 1; i--) {
                    let squareAttacked = i == 1 ? false : (this.color == 'white' ? chessBoard[this.row][i].isSquareAttackedByBlack : chessBoard[this.row][i].isSquareAttackedByWhite)
                    if (chessBoard[this.row][i]?.chessPiece != null || squareAttacked) {
                        canQueenSideCastle = false
                    }
                }
            }

            //check king side castling
            let pieceAtRight = chessBoard[this.row][chessBoard[0].length - 1].chessPiece

            if (pieceAtRight?.type == 'rook' && pieceAtRight?.hasMoved == false && pieceAtRight?.color == this.color) {
                for (let i = this.col + 1; i < chessBoard[0].length - 1; i++) {
                    let squareAttacked = this.color == 'white' ? chessBoard[this.row][i].isSquareAttackedByBlack : chessBoard[this.row][i].isSquareAttackedByWhite
                    if (chessBoard[this.row][i]?.chessPiece != null || squareAttacked) {
                        canKingSideCastle = false
                    }
                }
            }

            //add queen side castle moves to movement arr
            if (canQueenSideCastle) {
                this.movementArr.push([this.row, 2])
            }
            //add king side castle moves to movement arr
            if (canKingSideCastle) {
                this.movementArr.push([this.row, chessBoard[0].length - 2])
            }
        }

    }

    copy() {
        return new King(this.row, this.col, this.color, this.hasMoved)
    }
    static withinCaptureReach(board: ChessBoardModel, row: number, col: number, proxyType: string | null, color: string) {
        return []
    }
}





