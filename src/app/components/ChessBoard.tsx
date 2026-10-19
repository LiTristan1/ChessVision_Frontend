import { FontAwesome6 } from "@react-native-vector-icons/fontawesome6";
import { memo } from 'react';
import { Pressable, View } from "react-native";
import { colors } from "../../../themes/themes";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { ChessGame, Position } from '../models/pieces';
import { setCurrentAnalyzedMove } from "../Store/slices/GamesSlices";
import { Square } from "./Square";
type Props = {
    currentPosition: Position,
    setCurrentPosition: React.Dispatch<React.SetStateAction<Position>>,
    chessGame: ChessGame
    setMoves: React.Dispatch<React.SetStateAction<string[][]>>
    updateAnalysisIndex?: boolean
    lockMoves: boolean
    onBack: () => void
    onNext: () => void
    onMove: () => void
}
export const ChessBoard = memo(function ChessBoard(
    { currentPosition, setCurrentPosition, chessGame, setMoves, updateAnalysisIndex, lockMoves, onBack, onNext, onMove }: Props
) {
    const dispatch = useAppDispatch()
    const analyzingIndex = useAppSelector(state => state.games.analyzingMoveIndex)
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
                                                lockMoves={lockMoves}
                                                onMove={onMove}

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
                            onBack()
                            chessGame.moveIndex = chessGame.moveIndex - 1
                            console.log(`Is same as current ${currentPosition == currentPosition.prev}`)
                            setCurrentPosition(currentPosition.prev)

                            //multiple components use this screen to need to make sure only the component that 
                            //is analyzing can change any of the variables related to any analysis 
                            if (updateAnalysisIndex) {
                                dispatch(setCurrentAnalyzedMove(analyzingIndex - 1))
                            }
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
                        if (currentPosition.next != null && currentPosition.next[0] != null) {
                            setCurrentPosition(currentPosition.next[0])
                            if (updateAnalysisIndex) {
                                dispatch(setCurrentAnalyzedMove(analyzingIndex + 1))
                            }

                            onNext()

                        }
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
)