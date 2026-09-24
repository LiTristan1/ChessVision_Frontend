import { StyleSheet } from "react-native"


export const TextStyles = StyleSheet.create({
    primary: {
        fontSize: 48,
        color: 'white'
    },
    secondary: {
        fontSize: 32,
        color: 'white'

    },
    tertiary: {
        fontSize: 24,
        color: 'white'
    },
    description: {
        fontSize: 16,
        color: 'white'
    },
    subtitle: {
        fontSize: 16,
        color: 'grey'
    }
})


export const containers = StyleSheet.create({
    PrimaryContainer: {
        flex: 1,
        width: "100%",
        height: "100%",
        backgroundColor: "#000000",
        padding: 5,
        gap: 16,


    },
    ScrollContainer: {
        gap: 15,
    }
})



export const colors = {
    iconTint: "#4D7CFE",
    componentBackground: "#101C28",
    chessSquareLightColor: "#E5EBCB",
    chessSquareDarkColor: "#7FA273",
}


