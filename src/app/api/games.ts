import { ChessGame, Position } from "../models/pieces";
import { getValueFor, save } from "../services/secureStore";
import { FullAnalysisInputType, PositionAnalysis, type Game, type MovesPGN, type Opening } from "../types/responses";

export async function getUserGames(year: number = new Date().getFullYear()) {
    console.log("========== GET USER GAMES START ==========");

    const accessToken = await getValueFor("Access-Token");
    const refreshToken = await getValueFor("Refresh-Token");

    console.log("ACCESS EXISTS:", !!accessToken);
    console.log("REFRESH EXISTS:", !!refreshToken);

    const url =
        `${process.env.EXPO_PUBLIC_REST_BASE_URL}/games/${year}`;

    console.log("REQUEST URL:", url);

    const response = await fetch(url, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "X-Refresh-Token": refreshToken ?? ""
        }
    });
    if (!response.ok) {
        const error = await response.text();
        console.log("Games request failed:", error);
        return null;

    }

    await save("Access-Token", response.headers.get("X-Access-Token"))
    await save("Refresh-Token", response.headers.get("X-Refresh-Token"))


    //parse it back to json
    const games: Game[][] = await response.json();
    console.log("MONTHS RECEIVED:", games.length);

    return games;


}




export async function getFullGameAnalysis(
   
    game: ChessGame
): Promise<PositionAnalysis[]> {
    const accessToken = await getValueFor("Access-Token");
    const refreshToken = await getValueFor("Refresh-Token");

    const moves = game.moves.flat();

    let currentPosition = game.positions?.next[0] ?? null;

    // Build ALL inputs before calling backend
    const inputs: FullAnalysisInputType[] = [];

    // Keep positions locally because the backend doesn't need
    // your full Position objects
    const positions: Position[] = [];
    const YEARS_BACK = 10

    const until = new Date().getFullYear();
    const since = until - YEARS_BACK;

    const uciMoves: string[] = [];

    for (let i = 0; i < moves.length && currentPosition; i++) {

        const gameString = ChessGame.movesToPgn(moves
            .slice(0, i + 1));

        //console.log("Used game string " + gameString)

        if (currentPosition.move) {
            uciMoves.push(
                currentPosition.move.from +
                currentPosition.move.to +
                (currentPosition.move.promotion ?? "")
            );
        }

        inputs.push({

            gameString,
            since,
            until,
            play: uciMoves.join(","),
            moves: 10
        });

        positions.push(currentPosition);

        currentPosition = currentPosition.next[0] ?? null;
    }

    //console.log("Values as input: " + JSON.stringify(inputs))

    try {
        const response = await fetch(
            `${process.env.EXPO_PUBLIC_REST_BASE_URL}/games/fullAnalysis`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                    "X-Refresh-Token": refreshToken ?? ""
                },
                body: JSON.stringify(inputs)
            }
        );



        // Save refreshed tokens BEFORE checking response.ok
        const newAccessToken = response.headers.get("X-Access-Token");
        const newRefreshToken = response.headers.get("X-Refresh-Token");

        if (newAccessToken) {
            await save("Access-Token", newAccessToken);
        }

        if (newRefreshToken) {
            await save("Refresh-Token", newRefreshToken);
        }

        if (!response.ok) {
            throw new Error(
                `Failed to analyze game: ${response.status}`
            );
        }

        const data = await response.json();

        const analysis: PositionAnalysis[] = inputs.map(
            (input, index) => ({
                id: game.id,
                moveIndex: index,
                gameString: input.gameString,
                masterGames: data[index]?.masterGames ?? [],
                otbStats: data[index]?.otbStats ?? null
            })
        );

        return analysis;

    } catch (error) {
        console.error(
            "Error analyzing full game:",
            error
        );

        return [];
    }
}

export async function getStockFishEvaluation(position: Position, chessGame: ChessGame) {

    const fen = ChessGame.getFenUpToPosition(position)

    const url = `${process.env.EXPO_PUBLIC_STOCKFISH_BASE_URL}?fen=${encodeURIComponent(fen)}&depth=15`
    console.log("Used stockfish url: " + url)
    try {
        const response = await fetch(url)
        if (!response.ok) {
            throw new Error(
                `Stockfish HTTP error: ${response.status}`
            );
        }
        const response_json = await response.json()
        console.log("STOCKFISH RESPONSE: " + JSON.stringify(response_json))

        return response_json
    } catch (e) {
        console.log("Error getting stockfish analysis: " + e)
    }
}

export async function getOpeningDB() {
    const url = `${process.env.EXPO_PUBLIC_REST_BASE_URL}/games/openings/variations`
    console.log("Getting openings used url: " + url)
    const accessToken = await getValueFor("Access-Token");
    const refreshToken = await getValueFor("Refresh-Token");

    try {
        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                "X-Refresh-Token": refreshToken ?? ""
            }
        })
        // Save refreshed tokens BEFORE checking response.ok
        const newAccessToken = response.headers.get("X-Access-Token");
        const newRefreshToken = response.headers.get("X-Refresh-Token");

        if (newAccessToken) {
            await save("Access-Token", newAccessToken);
        }

        if (newRefreshToken) {
            await save("Refresh-Token", newRefreshToken);
        }
        if (!response.ok) {
            throw new Error(
                `Failed to get openings: ${response.status}`
            );
        }
        const response_json: Opening[] = await response.json()
        return response_json
    } catch (e) {
        console.log("Error fetching openings db: " + e)
    }


}

export async function getGameById(id: string) {
    const url = `${process.env.EXPO_PUBLIC_REST_BASE_URL}/games/game/${id}`
    const accessToken = await getValueFor("Access-Token");
    const refreshToken = await getValueFor("Refresh-Token");

    try {
        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                "X-Refresh-Token": refreshToken ?? ""
            }
        })
        // Save refreshed tokens BEFORE checking response.ok
        const newAccessToken = response.headers.get("X-Access-Token");
        const newRefreshToken = response.headers.get("X-Refresh-Token");

        if (newAccessToken) {
            await save("Access-Token", newAccessToken);
        }

        if (newRefreshToken) {
            await save("Refresh-Token", newRefreshToken);
        }

        if (!response.ok) {
            throw new Error(
                `Failed to get game by id for id ${id}: ${response.status}`
            );
        }
        const response_json: MovesPGN = await response.json()

        console.log("Received game by ID: " + JSON.stringify(response_json.moves))
        return response_json.moves

    } catch (e) {
        console.log("Error getting game by id: " + e)
    }
}