/**
 * High-performance Levenshtein distance and fuzzy matching algorithm
 * for intelligent Pokémon search with typo tolerance (e.g. 'charzard' -> 'charizard')
 */

export function levenshteinDistance(str1, str2) {
  const m = str1.length;
  const n = str2.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }

  return dp[m][n];
}

export function fuzzyMatchPokemon(pokemonList, query) {
  if (!query || !query.trim()) return pokemonList;

  const q = query.toLowerCase().trim();
  const qLen = q.length;

  return pokemonList
    .map((p) => {
      const name = p.name.toLowerCase();
      const idStr = String(p.id);

      // Exact match or substring
      if (idStr === q) return { pokemon: p, score: 100 };
      if (name === q) return { pokemon: p, score: 95 };
      if (name.startsWith(q)) return { pokemon: p, score: 85 };
      if (name.includes(q)) return { pokemon: p, score: 75 };

      // Typo tolerance: Levenshtein distance
      const dist = levenshteinDistance(name, q);
      const maxAllowedDist = qLen > 6 ? 2 : qLen > 3 ? 1 : 0;

      if (dist <= maxAllowedDist) {
        return { pokemon: p, score: 60 - dist * 10 };
      }

      return null;
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.pokemon);
}
