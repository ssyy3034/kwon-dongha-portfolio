export const COMPETENCY_STANDARDS = {
  CS: {
    difficulty: 2.2, // CS는 조금 더 깊이 있게 (더 어려운 목표)
    keywords: [
      "process",
      "thread",
      "scheduling",
      "http",
      "tcp",
      "udp",
      "stack",
      "queue",
      "deadlock",
      "race condition",
      "mutex",
      "virtual memory",
      "paging",
      "segmentation",
      "handshake",
      "ssl",
      "tls",
      "dns",
      "rest",
      "session",
      "context switching",
      "system call",
      "congestion control",
      "flow control",
      "b-tree",
      "hash collision",
      "content hashing",
      "indexeddb",
    ],
  },
  알고리즘: {
    difficulty: 2.0,
    keywords: [
      "bfs",
      "dfs",
      "binary search",
      "sort",
      "recursion",
      "memoization",
      "greedy",
      "two pointer",
      "dynamic programming",
      "dp",
      "backtracking",
      "dijkstra",
      "mst",
      "kruskal",
      "prim",
      "union find",
      "trie",
      "bitmask",
      "heap",
      "optimization",
      "complexity",
    ],
  },
  프론트엔드: {
    difficulty: 1.2, // 주력 분야는 조금 더 수월하게 채워지도록 (전문성 과시)
    keywords: [
      "html",
      "css",
      "js",
      "javascript",
      "react",
      "hooks",
      "component",
      "virtual dom",
      "lifecycle",
      "context",
      "typescript",
      "generic",
      "redux",
      "recoil",
      "zustand",
      "next.js",
      "ssr",
      "csr",
      "performance",
      "optimization",
      "lcp",
      "cls",
      "lazy loading",
      "code splitting",
      "tiptap",
      "prosemirror",
      "d3.js",
      "canvas",
      "flexbox",
      "grid",
      "responsive",
      "spa",
      "dom",
    ],
  },
  백엔드: {
    difficulty: 1.4,
    keywords: [
      "node.js",
      "express",
      "nest",
      "api",
      "rest",
      "graphql",
      "sql",
      "nosql",
      "mysql",
      "mongodb",
      "redis",
      "index",
      "normalization",
      "transaction",
      "acid",
      "orm",
      "prisma",
      "jwt",
      "oauth",
      "session",
      "socket",
      "json",
      "auth",
      "middleware",
      "crud",
      "database",
      "server",
    ],
  },
  AI: {
    difficulty: 1.2,
    keywords: [
      "ai",
      "llm",
      "gpt",
      "copilot",
      "prompt",
      "embedding",
      "rag",
      "vector",
      "langchain",
      "transformer",
      "fine-tuning",
      "inference",
      "model",
      "token",
      "huggingface",
      "openai",
      "claude",
      "gemini",
      "cursor",
      "automation",
      "code generation",
      "ml",
    ],
  },
};

export interface CompetencyScore {
  category: string;
  score: number;
  fullMark: number;
  missingKeywords: string[];
  acquiredKeywords: string[];
  totalKeywordsCount: number;
}

interface DocMetadata {
  content: string;
  length: number;
  hasCodeBlock: boolean;
  linkCount: number;
}

interface ConsistencyStats {
  totalDocs: number;
  streak: number;
  activeDaysLastMonth: number;
}

/**
 * 'Goldilocks' Scoring Logic
 * 1. Base Boost: 활동이 있다면 35%부터 시작 (성실함의 최소 표현)
 * 2. Diminishing Returns: 85% 이후부터는 점수 상승폭을 극도로 제한 (완벽한 척 방지)
 * 3. Junior Sweet Spot: 70~85% 구간이 가장 오래 머물도록 설계
 */
export function evaluateCompetency(
  docs: DocMetadata[],
  stats: ConsistencyStats,
): CompetencyScore[] {
  const categoryScores: Record<
    string,
    { acquired: Set<string>; totalScore: number }
  > = {};

  Object.keys(COMPETENCY_STANDARDS).forEach((cat) => {
    categoryScores[cat] = { acquired: new Set(), totalScore: 0 };
  });

  docs.forEach((doc) => {
    let docWeight = 1.0;
    if (doc.length > 2000) docWeight += 0.8;
    if (doc.hasCodeBlock) docWeight += 0.7;

    const contentLower = doc.content.toLowerCase();

    Object.entries(COMPETENCY_STANDARDS).forEach(([cat, standard]) => {
      const docKeywordsFound = new Set<string>();
      standard.keywords.forEach((kw) => {
        if (contentLower.includes(kw)) {
          docKeywordsFound.add(kw);
          let keywordWeight = 1.0;
          if (
            ["react", "js", "api", "ai", "html", "css", "javascript"].includes(
              kw,
            )
          )
            keywordWeight = 0.4;

          categoryScores[cat].acquired.add(kw);
          const contribution =
            Math.min(docKeywordsFound.size, 5) *
            0.4 *
            docWeight *
            keywordWeight;
          categoryScores[cat].totalScore += contribution;
        }
      });
    });
  });

  const results = Object.entries(COMPETENCY_STANDARDS).map(
    ([category, standard]) => {
      const data = categoryScores[category];
      const totalKeywords = standard.keywords.length;

      // 점수 로직 고도화
      const baseScore = data.acquired.size > 0 ? 35 : 0; // 성장의 시작점 (겸손하지만 빈약하지 않게)

      const coverageRatio = Math.min(data.acquired.size / totalKeywords, 1);
      const coverageScore = coverageRatio * 35; // 최대 35점

      const targetDepthScore =
        totalKeywords * 1.5 * (standard.difficulty || 1.0);
      const depthRatio = Math.min(data.totalScore / targetDepthScore, 1);
      const depthScore = depthRatio * 25; // 최대 25점

      let rawFinal = baseScore + coverageScore + depthScore;

      // 완벽한 척 방지 로직 (Diminishing Returns)
      // 85점을 넘어서는 순간 상승폭을 1/5로 축소하여 99점에 도달하기 매우 어렵게 만듦
      if (rawFinal > 85) {
        rawFinal = 85 + (rawFinal - 85) / 5;
      }

      const finalScore = Math.round(rawFinal);
      const missing = standard.keywords.filter((kw) => !data.acquired.has(kw));

      return {
        category,
        score: finalScore,
        fullMark: 100,
        missingKeywords: missing,
        acquiredKeywords: Array.from(data.acquired),
        totalKeywordsCount: totalKeywords,
      };
    },
  );

  const docScore = Math.min(stats.totalDocs / 40, 1) * 40;
  const activeDayScore = Math.min(stats.activeDaysLastMonth / 12, 1) * 30;
  const streakScore = Math.min(stats.streak / 5, 1) * 30;

  const consistencyScore = Math.round(docScore + activeDayScore + streakScore);

  results.push({
    category: "학습 성실도",
    score: consistencyScore,
    fullMark: 100,
    missingKeywords: [],
    acquiredKeywords: [
      `문서: ${stats.totalDocs}개`,
      `활동: 월 ${stats.activeDaysLastMonth}일`,
      `연속: ${stats.streak}일`,
    ],
    totalKeywordsCount: 0,
  });

  return results;
}
