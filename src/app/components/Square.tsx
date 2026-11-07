import { FontAwesome6 } from "@react-native-vector-icons/fontawesome6";
import { ComponentProps } from "react";
import { Pressable, View } from "react-native";
import { useAppSelector } from "../hooks/reduxHooks";
import { Bishop, ChessBoardModel, ChessGame, ChessSquareModel, King, Knight, Pawn, Position, Queen, Rook } from '../models/pieces';
import { UCIMove } from "../types/responses";
type Props = {
    row: number,
    col: number
    backgroundColor: string,
    chessPiece: (Pawn | Rook | King | Queen | Knight | Bishop | null)
    isPossibleMove: boolean
    board: ChessBoardModel
    position: Position
    setCurrentPosition: React.Dispatch<React.SetStateAction<Position>>
    setMoves: React.Dispatch<React.SetStateAction<string[][]>>
    chessGame: ChessGame
    isInCheck: boolean
    lockMoves: boolean
    onMove: (move: UCIMove) => void
}
export function Square(
    { row, col, backgroundColor, chessPiece, isPossibleMove, board, position, setCurrentPosition, chessGame, isInCheck, setMoves, lockMoves, onMove }: Props
) {
    const hasSelectedGame = useAppSelector(state => state.games.hasSelectedGame)

    function handleMovementProcedure(promoting: boolean = false) {

        console.log("===== BEFORE MOVE =====");
        console.log("Current turn:", board.whosMove);
        console.log("Moving piece:", board.movingPiece);
        console.log("Destination:", row, col);
        console.log("Current position index:", position.moveIndex);
        let copy = new ChessBoardModel()
        copy.initBoard()
        ChessBoardModel.copyModel(board, copy)
        console.log("Going past condition")

        //promotion already handled after movement
        copy.board[row][col].isPromoting = false

        //check is something is captured for the notation function
        let isCapturing = (copy.board[row][col].chessPiece != null)

        let notatedMove = ChessBoardModel.getNotation(copy, copy.board[copy.movingPiece[0]][copy.movingPiece[1]].chessPiece, [copy.movingPiece[0], copy.movingPiece[1]], [row, col], isCapturing, promoting ? board.promotingPiece : null)

        copy.movePiece(copy.movingPiece[0], copy.movingPiece[1], row, col, promoting ? board.promotingPiece : null)

        if (copy.board[row][col].chessPiece != null) {
            copy.board[row][col].chessPiece.hasMoved = true
        }
        copy.whosMove = copy.whosMove == 'white' ? 'black' : 'white'
        copy.clearPossibleMoves()

        //this is the previously moved piece square
        copy.previouslyMovedPieceSquare = [row, col]

        copy.recomputeAttackedSquares()
        //also make a new position
        let newPosition = new Position(copy, [], position)
        position.next?.push(newPosition)


        let promotionUci = ""

        if (promoting && board.promotingPiece != null) {
            promotionUci = ChessBoardModel.promotionUci(board.promotingPiece)
        }
        newPosition.move = {
            from: ChessBoardModel.indiceToUciMoveString([copy.movingPiece[0], copy.movingPiece[1]]),
            to: ChessBoardModel.indiceToUciMoveString([row, col]),
            promotion: promotionUci as NonNullable<Position['move']>['promotion']
        }
        console.log("Move Index: ", chessGame.moveIndex)

        //if we already are analyzing a game dont add the new move into the scoresheet (allow sublines in a future release)
        if (!hasSelectedGame) {
            if (chessGame.moveIndex >= 0 && chessGame.moves[chessGame.moveIndex].length < 2) {

                console.log("Adding new move to same index")
                chessGame.moves[chessGame.moveIndex].push(notatedMove)
            } else {
                chessGame.moveIndex = chessGame.moveIndex + 1
                chessGame.moves.push([notatedMove])
            }

            setMoves([...chessGame.moves])
        }
        newPosition.prev = position
        newPosition.moveIndex = chessGame.moveIndex
        setCurrentPosition(newPosition)

        onMove(newPosition.move)

    }

    let fontAwesomePieceName: ComponentProps<typeof FontAwesome6>["name"] = "chess-pawn"

    switch (chessPiece?.type) {
        case "pawn": {
            fontAwesomePieceName = "chess-pawn"
            break;
        }
        case "knight": {
            fontAwesomePieceName = "chess-knight"
            break;
        }
        case "bishop": {
            fontAwesomePieceName = "chess-bishop"
            break;
        }
        case "rook": {
            fontAwesomePieceName = "chess-rook"
            break
        }
        case "queen": {
            fontAwesomePieceName = "chess-queen"
            break;
        }
        case "king": {
            fontAwesomePieceName = "chess-king"
            break;
        }
        default: {
            fontAwesomePieceName = "chess-queen"
            break;
        }
    }
    return (
        <Pressable
            className="w-[12.5%] aspect-square flex justify-center items-center overflow-visible"
            style={{
                backgroundColor:
                    isInCheck && chessPiece?.type === "king"
                        ? "red"
                        : backgroundColor,
                zIndex: board.board[row][col].isPromoting ? 100 : 1,
            }}
            onPress={() => {

                if (!lockMoves) {
                    console.log("===== SQUARE PRESSED =====");
                    console.log("Square:", row, col);
                    console.log("isPossibleMove:", isPossibleMove);
                    console.log("Board possible moves:", board.possibleMoves);
                    console.log("Current turn:", board.whosMove);
                    console.log("Piece color:", chessPiece?.color);
                    console.log("Selected piece:", board.movingPiece);

                    //clear all moves
                    board.clearPossibleMoves()
                    if (!isPossibleMove) {
                        board.board[row][col].isPromoting = false
                        if (chessPiece != null && board.whosMove == chessPiece.color) {
                            if (board.isChecking && chessPiece.type != 'king') {
                                return;
                            }
                            chessPiece.getMovementArr(
                                board
                            )
                            board.possibleMoves = chessPiece.movementArr
                            board.movingPiece = [row, col]

                            let copy = new ChessBoardModel()
                            copy.initBoard()
                            ChessBoardModel.copyModel(board, copy)

                            for (let i = 0; i < copy.possibleMoves.length; i++) {
                                let move = copy.possibleMoves[i];
                                copy.board[move[0]][move[1]].isPossibleMove = true
                            }

                            let updatedPosition = new Position(copy, position.next, position.prev)
                            updatedPosition.move = position.move
                            updatedPosition.moveIndex = position.moveIndex
                            updatedPosition.evaluation = position.evaluation
                            setCurrentPosition(updatedPosition)
                        }
                    } else {
                        //make a new board state to be tracked by the game
                        let copy = new ChessBoardModel()
                        copy.initBoard()
                        ChessBoardModel.copyModel(board, copy)

                        let promotionRow = copy.board[copy.movingPiece[0]][copy.movingPiece[1]].chessPiece?.color == 'white' ? ChessSquareModel.whitePromotionRow : ChessSquareModel.blackPromotionRow
                        if (copy.board[copy.movingPiece[0]][copy.movingPiece[1]].chessPiece?.type == 'pawn' && row == promotionRow) {
                            console.log("Still inside condition")
                            copy.board[row][col].isPromoting = true
                            setCurrentPosition(new Position(copy, position.next, position.prev))
                            return
                        }
                        handleMovementProcedure()

                    }
                }

                //make a copy of the board
                //trigger recomposition
            }}
        >
            {
                isPossibleMove &&
                <View className={`absolute rounded-full ${chessPiece
                    ? "w-[80%] h-[80%] bg-green-500/40"
                    : "w-[30%] h-[30%] bg-green-500/70"}`}>

                </View>
            }
            {chessPiece &&
                <FontAwesome6
                    name={fontAwesomePieceName}
                    size={28}
                    color={chessPiece.color}
                    iconStyle="solid"
                />
            }

            {
                board.board[row][col].isPromoting && (
                    <View
                        className="absolute w-full z-50"
                        style={{
                            top: row === ChessSquareModel.whitePromotionRow
                                ? 0
                                : undefined,
                            bottom: row === ChessSquareModel.blackPromotionRow
                                ? 0
                                : undefined,
                            flexDirection:
                                row === ChessSquareModel.blackPromotionRow
                                    ? "column-reverse"
                                    : "column",
                        }}
                    >
                        <Pressable
                            className="w-full aspect-square items-center justify-center bg-[#F0F0F0]"
                            onPress={() => {
                                console.log("Promoting to queen")
                                board.promotingPiece = "queen"
                                board.board[row][col].isPromoting = false
                                handleMovementProcedure(true)
                            }}
                        >
                            <FontAwesome6
                                name="chess-queen"
                                size={30}
                                iconStyle="solid"
                                color={board.whosMove}
                            />
                        </Pressable>

                        <Pressable
                            className="w-full aspect-square items-center justify-center bg-[#E0E0E0]"
                            onPress={() => {
                                console.log("Promoting to knight")
                                board.promotingPiece = "knight"
                                board.board[row][col].isPromoting = false
                                handleMovementProcedure(true)
                            }}
                        >
                            <FontAwesome6
                                name="chess-knight"
                                size={30}
                                iconStyle="solid"
                                color={board.whosMove}
                            />
                        </Pressable>

                        <Pressable
                            className="w-full aspect-square items-center justify-center bg-[#F0F0F0]"
                            onPress={() => {
                                console.log("Promoting to rook")
                                board.promotingPiece = "rook"
                                board.board[row][col].isPromoting = false
                                handleMovementProcedure(true)
                            }}
                        >
                            <FontAwesome6
                                name="chess-rook"
                                size={30}
                                iconStyle="solid"
                                color={board.whosMove}
                            />
                        </Pressable>

                        <Pressable
                            className="w-full aspect-square items-center justify-center bg-[#E0E0E0]"
                            onPress={() => {
                                console.log("Promoting to bishop")
                                board.promotingPiece = "bishop"
                                board.board[row][col].isPromoting = false
                                handleMovementProcedure(true)

                            }}
                        >
                            <FontAwesome6
                                name="chess-bishop"
                                size={30}
                                iconStyle="solid"
                                color={board.whosMove}
                            />
                        </Pressable>
                    </View>
                )
            }

        </Pressable>
    )
}

