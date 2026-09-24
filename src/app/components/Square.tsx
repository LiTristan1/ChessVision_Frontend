import { FontAwesome6 } from "@react-native-vector-icons/fontawesome6";
import { ComponentProps } from "react";
import { Pressable, View } from "react-native";
import { Bishop, ChessBoardModel, ChessGame, ChessSquareModel, King, Knight, Pawn, Position, Queen, Rook } from '../models/pieces';
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
}
export function Square(
    { row, col, backgroundColor, chessPiece, isPossibleMove, board, position, setCurrentPosition, chessGame, isInCheck, setMoves }: Props
) {

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
            className="w-[12.5%] aspect-square flex justify-center items-center"
            style={{
                backgroundColor:
                    isInCheck && chessPiece?.type === "king"
                        ? "red"
                        : backgroundColor
            }}
            onPress={() => {
                //clear all moves
                board.clearPossibleMoves()
                if (!isPossibleMove) {
                    board.isPromoting = false
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
                        setCurrentPosition(updatedPosition)
                    }
                } else {
                    //make a new board state to be tracked by the game
                    let copy = new ChessBoardModel()
                    copy.initBoard()
                    ChessBoardModel.copyModel(board, copy)
                    let promotionRow = copy.board[copy.movingPiece[0]][copy.movingPiece[1]].chessPiece?.color == 'white' ? ChessSquareModel.whitePromotionRow : ChessSquareModel.blackPromotionRow
                    if (copy.board[copy.movingPiece[0]][copy.movingPiece[1]].chessPiece?.type == 'pawn' && row == promotionRow) {
                        copy.board[row][col].isPromoting = true
                        setCurrentPosition(new Position(copy, position.next, position.prev))
                        return
                    }

                    //check is something is captured for the notation function
                    let isCapturing = (copy.board[row][col].chessPiece != null)

                    let notatedMove = ChessBoardModel.getNotation(copy, copy.board[copy.movingPiece[0]][copy.movingPiece[1]].chessPiece, [copy.movingPiece[0], copy.movingPiece[1]], [row, col], isCapturing)

                    copy.movePiece(copy.movingPiece[0], copy.movingPiece[1], row, col)

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


                    console.log("Move Index: ", chessGame.moveIndex)
                    if (chessGame.moveIndex >= 0 && chessGame.moves[chessGame.moveIndex].length < 2) {

                        console.log("Adding new move to same index")
                        chessGame.moves[chessGame.moveIndex].push(notatedMove)
                    } else {
                        chessGame.moveIndex = chessGame.moveIndex + 1
                        chessGame.moves.push([notatedMove])
                    }

                    setMoves([...chessGame.moves])
                    newPosition.prev = position

                    setCurrentPosition(newPosition)

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
                board.board[row][col].isPromoting &&
                <View
                    className="
            absolute
            z-50
            w-full
            rounded-md
            overflow-hidden
            bg-[#E8E8E8]
        "
                    style={{
                        top: 0,
                    }}
                >
                    <Pressable
                        className="w-full aspect-square items-center justify-center bg-[#F0F0F0] active:bg-[#D0D0D0]"
                        onPress={() => {
                            // Queen promotion
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
                        className="w-full aspect-square items-center justify-center bg-[#E0E0E0] active:bg-[#C8C8C8]"
                        onPress={() => {
                            // Knight promotion
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
                        className="w-full aspect-square items-center justify-center bg-[#F0F0F0] active:bg-[#D0D0D0]"
                        onPress={() => {
                            // Rook promotion
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
                        className="w-full aspect-square items-center justify-center bg-[#E0E0E0] active:bg-[#C8C8C8]"
                        onPress={() => {
                            // Bishop promotion
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
            }

        </Pressable>
    )
}