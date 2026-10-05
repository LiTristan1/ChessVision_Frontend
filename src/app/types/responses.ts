

export type FullAnalysisResultType = {
    gameString: string;
    play: string;

    masterGames: GameStats;
    timeStats: GameStats | null;
    otbStats: GameStats | null;
};


export type FullAnalysisInputType = {

    gameString: string;
    moves: number;
    until: number;
    since: number;
    play: string;
};
export type GameType = {
    archives: string[]
}

type UCIMove = {
    from: string;
    to: string;
    promotion: "q" | "r" | "b" | "n" | "";
};
export type DbGameType = {
    id: string,
    site: string,
    game_date: string,
    round: string,
    white: string,
    black: string,
    result: string,
    ply_count: number,
    white_elo: number,
    white_fide_id: number,
    white_fide_title: string,
    black_elo: number,
    eco: string,
    source: string,
    source_quality: string,
    import_date: string,
    moves: string,
    game_pgn: string
}
export type Game = {
    url: string,
    time_control: string,
    end_time: number,
    rated: Boolean,
    time_class: TimeClass,
    rules: string,
    uuid: string,
    white: PlayerQuickInfo,
    black: PlayerQuickInfo,
    eco: string,
    initial_setup: string,
    fen: string,
    pgn: string
}
export type gamesByYear = {
    year: number,
    games: Game[][] | null
}
type PlayerQuickInfo = {
    rating: number,
    result: GameResult,
    username: string,
    uuid: string
}
export type TimeClass = "bullet" | "blitz" | "rapid" | "daily"

export type GameResult =
    | "win"
    | "checkmated"
    | "agreed"
    | "repetition"
    | "timeout"
    | "resigned"
    | "stalemate"
    | "lose"
    | "insufficient"
    | "50move"
    | "abandoned"
    | "kingofthehill"
    | "threecheck"
    | "timevsinsufficient"
    | "bughousepartnerlose";

export type Move = {
    moveNumber: number,
    whiteMove: String | null,
    blackMove: String | null
}

export type player = {
    userName: string,
    chessId: string,
    profileLink: string,
    followers: number,
    country: string,
    league: string,
    playerStats: playerStats
}

export type playerStats = {
    overallWinRate: number,
    winRateAsWhite: number,
    winRateAsBlack: number,
    bestOpeningWinRate: number,
    rating: number,
    highestRating: number,
    highestRatingDate: string,
    puzzlesRating: number,
    peakPuzzleRush: number
}

export type GameStats = {
    games: number,
    white_wins: number,
    draws: number,
    black_wins: number
}

export type GameStatsQueryResponse = {
    result: string,
    count: string
}

export type LichessOpeningResponse = {
    white: number;
    draws: number;
    black: number;
    moves: LichessMove[];
};

export type LichessMove = {
    uci: string;
    san: string;
    averageRating: number;
    white: number;
    draws: number;
    black: number;
    game: unknown | null;
    opening: LichessOpening | null;
};

export type LichessOpening = {
    eco: string;
    name: string;
};


