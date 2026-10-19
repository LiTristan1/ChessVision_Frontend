export function normalizeText(text: string): string {
    return text
        .toLowerCase()
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/['’]s\b/g, "") // queen's -> queen
        .replace(/[^a-z0-9\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

export function levenshtein(a: string, b: string): number {
    const dp = Array.from(
        { length: a.length + 1 },
        () => new Array<number>(b.length + 1).fill(0)
    );

    for (let i = 0; i <= a.length; i++) {
        dp[i][0] = i;
    }

    for (let j = 0; j <= b.length; j++) {
        dp[0][j] = j;
    }

    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
            dp[i][j] = Math.min(
                dp[i - 1][j] + 1,
                dp[i][j - 1] + 1,
                dp[i - 1][j - 1] +
                (a[i - 1] === b[j - 1] ? 0 : 1)
            );
        }
    }

    return dp[a.length][b.length];
}


function wordMatches(query: string, target: string): boolean {
    if (target.startsWith(query)) {
        return true;
    }

    // Allow singular/plural differences
    if (query.replace(/s$/, "") === target.replace(/s$/, "")) {
        return true;
    }

    // Avoid overly broad fuzzy matches on short words
    if (query.length < 4) {
        return false;
    }

    const maxDistance = query.length >= 7 ? 2 : 1;

    return levenshtein(query, target) <= maxDistance;
}

export function fuzzySearch(query: string, target: string): boolean {
    const normalizedQuery = normalizeText(query);
    const normalizedTarget = normalizeText(target);

    if (!normalizedQuery) {
        return true;
    }

    if (normalizedTarget.includes(normalizedQuery)) {
        return true;
    }

    const queryWords = normalizedQuery.split(" ");
    const targetWords = normalizedTarget.split(" ");

    return queryWords.every(queryWord =>
        targetWords.some(targetWord =>
            wordMatches(queryWord, targetWord)
        )
    );
}