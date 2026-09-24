import { CartesianChart, Line } from 'victory-native'
type Props = {
    data: number[]

}

export function Graph(
    { data }: Props
) {

    const dataMapped = data.map((value, index) => {
        return {
            move: index + 1,
            accuracy: value
        }
    })
    return (
        <CartesianChart
            data={dataMapped}
            xKey="move"
            yKeys={["accuracy"]}

        >
            {({ points }) => (
                //👇 pass a PointsArray to the Line component, as well as options.
                <Line
                    points={points.accuracy}
                    color="red"
                    strokeWidth={3}
                    animate={{ type: "timing", duration: 300 }}
                />
            )}

        </CartesianChart>
    )
}