import {
    Bishop,
    ChessBoardModel,
    ChessGame,
    Knight,
    Pawn,
    Position,
    Queen,
    Rook
} from "../models/pieces";
export function GameParser(pgn: string): ChessGame {

    // 1. Create initial chess board
    const board = new ChessBoardModel();
    board.initBoard();

    // 2. Create initial position
    const initialPosition = new Position(
        board,
        [],
        null
    );

    // 3. Create new game
    const chessGame = new ChessGame(initialPosition);
    // 4. Extract moves from PGN
    const moves: string[] = pgn
        .replace(/\[[^\]]*\]/g, "")            // headers
        .replace(/\{[^}]*\}/g, "")              // annotations
        .replace(/\d+\.\.\.|\d+\./g, "")        // move numbers
        .replace(/1-0|0-1|1\/2-1\/2|\*/g, "")  // result
        .trim()
        .split(/\s+/);

    // 5. Start at initial position
    let currentPosition = initialPosition;

    // 6. Parse every move sequentially
    for (const move of moves) {

        const newPosition = parseMove(
            chessGame,
            currentPosition,
            currentPosition.position,
            move
        );

        if (newPosition === null) {
            console.error(
                `Failed to parse move: ${move}`
            );

            break;
        }

        // Next move operates on the board
        // resulting from the previous move
        currentPosition = newPosition;
    }

    // 7. Return fully constructed game
    return chessGame;
}


// Parse one SAN move into the board/position
export function parseMove(
    chessGame: ChessGame,
    position: Position,
    board: ChessBoardModel | null,
    move: string
): Position | null {

    if (board === null) {
        return null;
    }

    const whosMove = board.whosMove;

    // Remove check/checkmate
    const cleanMove = move.replace(/[+#]$/, "");


    const pieceType = cleanMove.charAt(0);

    // Copy current board
    const copy = new ChessBoardModel();
    copy.initBoard();

    ChessBoardModel.copyModel(board, copy);

    // =====================================
    // CASTLING
    // =====================================

    if (
        cleanMove === "O-O" ||
        cleanMove === "0-0"
    ) {
        const row =
            copy.whosMove === "white" ? 7 : 0;

        return handleMovementProcedure(
            row,
            4,
            row,
            6,
            copy,
            position,
            chessGame,
            move
        );
    }

    if (
        cleanMove === "O-O-O" ||
        cleanMove === "0-0-0"
    ) {
        const row =
            copy.whosMove === "white" ? 7 : 0;

        return handleMovementProcedure(
            row,
            4,
            row,
            2,
            copy,
            position,
            chessGame,
            move
        );
    }

    // =====================================
    // NORMAL MOVES
    // =====================================

    const destinationString =
        cleanMove.slice(-2);

    const [destinationRow, destinationCol] =
        ChessBoardModel.getRowColFromString(
            destinationString
        );


    switch (pieceType) {

        case "K": {


            let candidate = [0, 0]

            for (let i = 0; i < board.board.length; i++) {
                let found = false;
                for (let j = 0; j < board.board[0].length; j++) {
                    if (board.board[i][j].chessPiece?.type == 'king' && board.board[i][j].chessPiece?.color == board.whosMove) {
                        candidate = [i, j]
                        found = true;
                    }
                }

                if (found) {
                    break;
                }
            }

            if (candidate === null) {
                return null;
            }
            let uciPromotion: string = "";
            let indexOfEquals = move.indexOf('=')
            if (indexOfEquals != -1) {
                uciPromotion = move.charAt(indexOfEquals + 1)
            }

            position.move = {
                from: ChessBoardModel.indiceToMoveString(candidate),
                to: destinationString,
                promotion: uciPromotion as NonNullable<Position["move"]>["promotion"]
            }

            return handleMovementProcedure(
                candidate[0],
                candidate[1],
                destinationRow,
                destinationCol,
                copy,
                position,
                chessGame,
                move
            );
        }

        case "Q": {
            const candidates = Queen.withinCaptureReach(
                copy,
                destinationRow,
                destinationCol,
                "queen",
                whosMove
            );

            const candidate = getUniqueCandidate(
                candidates,
                cleanMove
            );

            if (candidate === null) {
                return null;
            }

            let uciPromotion: string = "";
            let indexOfEquals = move.indexOf('=')
            if (indexOfEquals != -1) {
                uciPromotion = move.charAt(indexOfEquals + 1)
            }

            position.move = {
                from: ChessBoardModel.indiceToMoveString(candidate),
                to: destinationString,
                promotion: uciPromotion as NonNullable<Position["move"]>["promotion"]
            }

            return handleMovementProcedure(
                candidate[0],
                candidate[1],
                destinationRow,
                destinationCol,
                copy,
                position,
                chessGame,
                move
            );
        }

        case "B": {
            const candidates = Bishop.withinCaptureReach(
                copy,
                destinationRow,
                destinationCol,
                "bishop",
                whosMove
            );

            const candidate = getUniqueCandidate(
                candidates,
                cleanMove
            );

            if (candidate === null) {
                return null;
            }

            let uciPromotion: string = "";
            let indexOfEquals = move.indexOf('=')
            if (indexOfEquals != -1) {
                uciPromotion = move.charAt(indexOfEquals + 1)
            }

            position.move = {
                from: ChessBoardModel.indiceToMoveString(candidate),
                to: destinationString,
                promotion: uciPromotion as NonNullable<Position["move"]>["promotion"]
            }

            return handleMovementProcedure(
                candidate[0],
                candidate[1],
                destinationRow,
                destinationCol,
                copy,
                position,
                chessGame,
                move
            );
        }

        case "N": {
            const candidates = Knight.withinCaptureReach(
                copy,
                destinationRow,
                destinationCol,
                "knight",
                whosMove
            );

            const candidate = getUniqueCandidate(
                candidates,
                cleanMove
            );

            if (candidate === null) {
                return null;
            }

            let uciPromotion: string = "";
            let indexOfEquals = move.indexOf('=')
            if (indexOfEquals != -1) {
                uciPromotion = move.charAt(indexOfEquals + 1)
            }

            position.move = {
                from: ChessBoardModel.indiceToMoveString(candidate),
                to: destinationString,
                promotion: uciPromotion as NonNullable<Position["move"]>["promotion"]
            }

            return handleMovementProcedure(
                candidate[0],
                candidate[1],
                destinationRow,
                destinationCol,
                copy,
                position,
                chessGame,
                move
            );
        }

        case "R": {
            const candidates = Rook.withinCaptureReach(
                copy,
                destinationRow,
                destinationCol,
                "rook",
                whosMove
            );

            const candidate = getUniqueCandidate(
                candidates,
                cleanMove
            );

            if (candidate === null) {
                return null;
            }

            let uciPromotion: string = "";
            let indexOfEquals = move.indexOf('=')
            if (indexOfEquals != -1) {
                uciPromotion = move.charAt(indexOfEquals + 1)
            }

            position.move = {
                from: ChessBoardModel.indiceToMoveString(candidate),
                to: destinationString,
                promotion: uciPromotion as NonNullable<Position["move"]>["promotion"]
            }

            return handleMovementProcedure(
                candidate[0],
                candidate[1],
                destinationRow,
                destinationCol,
                copy,
                position,
                chessGame,
                move
            );
        }

        default: {
            console.log("Pawn move:", move);

            const isCapture = cleanMove.includes("x");

            // ---------------- PAWN CAPTURE ----------------
            if (isCapture) {
                const candidates = Pawn.withinCaptureReach(
                    copy,
                    destinationRow,
                    destinationCol,
                    "pawn",
                    whosMove
                );

                /*
                 * SAN tells us which file the pawn came from:
                 *
                 * exd5 -> e
                 * cxb6 -> c
                 */
                const sourceFile = cleanMove.charAt(0);

                const sourceCol =
                    ChessBoardModel.getColFromString(sourceFile);

                const candidate = candidates.find(
                    candidate => candidate[1] === sourceCol
                );

                if (!candidate) {
                    console.error(
                        `Could not find pawn for capture ${move}`
                    );
                    return null;
                }

                let uciPromotion: string = "";
                let indexOfEquals = move.indexOf('=')
                if (indexOfEquals != -1) {
                    uciPromotion = move.charAt(indexOfEquals + 1)
                }

                position.move = {
                    from: ChessBoardModel.indiceToMoveString(candidate),
                    to: destinationString,
                    promotion: uciPromotion as NonNullable<Position["move"]>["promotion"]
                }

                return handleMovementProcedure(
                    candidate[0],
                    candidate[1],
                    destinationRow,
                    destinationCol,
                    copy,
                    position,
                    chessGame,
                    move
                );
            }


            // ---------------- NORMAL PAWN MOVE ----------------

            /*
             * White moves toward decreasing row numbers:
             *
             * d2 -> d4
             * [6,3] -> [4,3]
             *
             * Therefore when looking BACKWARDS from d4:
             * first check row 5, then row 6.
             *
             * Black is the opposite.
             */

            const backwardsDirection =
                whosMove === "white" ? 1 : -1;

            // First check one square behind destination
            const oneSquareBehind =
                destinationRow + backwardsDirection;

            if (
                ChessBoardModel.checkIfIsInBounds(
                    oneSquareBehind,
                    destinationCol
                )
            ) {
                const piece =
                    copy.board[oneSquareBehind][destinationCol]
                        .chessPiece;

                if (
                    piece !== null &&
                    piece.type === "pawn" &&
                    piece.color === whosMove
                ) {
                    return handleMovementProcedure(
                        oneSquareBehind,
                        destinationCol,
                        destinationRow,
                        destinationCol,
                        copy,
                        position,
                        chessGame,
                        move
                    );
                }
            }


            // ---------------- DOUBLE PAWN MOVE ----------------

            const twoSquaresBehind =
                destinationRow + (backwardsDirection * 2);

            if (
                ChessBoardModel.checkIfIsInBounds(
                    twoSquaresBehind,
                    destinationCol
                )
            ) {
                const piece =
                    copy.board[twoSquaresBehind][destinationCol]
                        .chessPiece;

                if (
                    piece !== null &&
                    piece.type === "pawn" &&
                    piece.color === whosMove
                ) {
                    return handleMovementProcedure(
                        twoSquaresBehind,
                        destinationCol,
                        destinationRow,
                        destinationCol,
                        copy,
                        position,
                        chessGame,
                        move
                    );
                }
            }


            console.error(
                `Could not find pawn that can move to ${destinationString}`
            );

            return null;
        }
    }
}


function getUniqueCandidate(
    candidates: number[][],
    move: string
): number[] | null {

    if (candidates.length === 1) {
        return candidates[0];
    }

    const cleanMove = move.replace(/[+#]$/, "");



    /*
        Examples:

        Qe4
        slice(1, -2) -> ""

        Qae4
        -> "a"

        Q3e4
        -> "3"

        Qa3e4
        -> "a3"

        Qaxe4
        -> "ax"
    */
    let disambiguation = cleanMove.slice(1, -2);

    // Capture symbol isn't part of disambiguation
    disambiguation = disambiguation.replace("x", "");

    for (const char of disambiguation) {

        // File / column
        if (/^[a-h]$/.test(char)) {

            const col =
                ChessBoardModel.getColFromString(char);

            candidates = candidates.filter(
                candidate => candidate[1] === col
            );
        }

        // Rank / row
        else if (/^[1-8]$/.test(char)) {

            const row =
                ChessBoardModel.getRowFromString(char);

            candidates = candidates.filter(
                candidate => candidate[0] === row
            );
        }
    }

    if (candidates.length !== 1) {

        console.error(
            `Could not uniquely identify piece for ${move}`,
            candidates
        );

        return null;
    }

    return candidates[0];
}


function handleMovementProcedure(
    rowFrom: number,
    colFrom: number,
    rowTo: number,
    colTo: number,
    copy: ChessBoardModel,
    position: Position,
    chessGame: ChessGame,
    move: string
): Position {

    copy.movePiece(
        rowFrom,
        colFrom,
        rowTo,
        colTo,
        null
    );

    copy.whosMove =
        copy.whosMove === "white"
            ? "black"
            : "white";

    copy.clearPossibleMoves();

    copy.previouslyMovedPieceSquare = [
        rowTo,
        colTo
    ];

    copy.recomputeAttackedSquares();

    const newPosition = new Position(
        copy,
        [],
        position
    );

    if (position.next == null) {
        position.next = [];
    }

    position.next.push(newPosition);

    newPosition.prev = position;

    if (
        chessGame.moveIndex >= 0 &&
        chessGame.moves[chessGame.moveIndex]?.length < 2
    ) {
        chessGame.moves[chessGame.moveIndex].push(move);
    } else {
        chessGame.moveIndex++;
        chessGame.moves.push([move]);
    }

    newPosition.moveIndex = chessGame.moveIndex;

    return newPosition; // IMPORTANT
}