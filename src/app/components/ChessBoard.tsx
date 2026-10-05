import { FontAwesome6 } from "@react-native-vector-icons/fontawesome6";
import { Pressable, View } from "react-native";
import { colors } from "../../../themes/themes";
import { ChessGame, Position } from '../models/pieces';
import { Square } from "./Square";

type Props = {
    currentPosition: Position,
    setCurrentPosition: React.Dispatch<React.SetStateAction<Position>>,
    chessGame: ChessGame
    setMoves: React.Dispatch<React.SetStateAction<string[][]>>
}
export function ChessBoard(
    { currentPosition, setCurrentPosition, chessGame, setMoves }: Props
) {

    const chessBoardModel = currentPosition.position
    return (
        <View className="w-full">


            <View
                className='w-full aspect-square flex-wrap'
            >
                {
                    chessBoardModel?.board.map((row, index) => {

                        return (
                            <View
                                key={index}
                                className='w-full flex-row'>
                                {
                                    row.map((square, indexCol) => {
                                        return (
                                            <Square
                                                key={indexCol}
                                                backgroundColor={(indexCol + index) % 2 == 0 ? colors.chessSquareLightColor : colors.chessSquareDarkColor}
                                                chessPiece={square.chessPiece}
                                                isPossibleMove={square.isPossibleMove}
                                                board={chessBoardModel}
                                                position={currentPosition}
                                                setCurrentPosition={setCurrentPosition}
                                                chessGame={chessGame}
                                                setMoves={setMoves}
                                                row={index}
                                                col={indexCol}
                                                isInCheck={square.isChecked}
                                            />
                                        )
                                    })
                                }






                            </View>
                        )

                    }
                    )
                }


            </View>
            <View className='w-full flex flex-row justify-between'>
                <Pressable
                    className="w-[45px] h-[45px] items-center justify-center rounded-full bg-[#101C28]"
                    onPress={() => {
                        console.log("Previous Pressed")
                        // go to previous position
                        if (currentPosition.prev != null) {
                            chessGame.moveIndex = chessGame.moveIndex - 1
                            console.log(`Is same as current ${currentPosition == currentPosition.prev}`)
                            setCurrentPosition(currentPosition.prev)
                        }
                    }}
                >

                    <FontAwesome6
                        name="arrow-left"
                        size={20}
                        color="white"
                        iconStyle="solid"
                    />
                </Pressable>
                <Pressable
                    className="w-[45px] h-[45px] items-center justify-center rounded-full bg-[#101C28]"
                    onPress={() => {
                        console.log("Next pressed")
                        // go to next position
                        if (currentPosition.next != null && currentPosition.next[0] != null) (
                            setCurrentPosition(currentPosition.next[0])
                        )
                    }
                    }
                >
                    <FontAwesome6
                        name="arrow-right"
                        size={20}
                        color="white"
                        iconStyle="solid"
                    />
                </Pressable>

            </View>
        </View >
    )
}