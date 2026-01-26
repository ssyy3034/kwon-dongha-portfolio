export interface ProblemSolving {
  challenge: string;
  approach: string;
  result: string;
}

export interface TechDecision {
  tech: string;
  reason: string;
  deepDive?: string; // 블로그 링크
}

export interface Project {
  id: string;
  title: string;
  description: string;
  period: string;
  role: string;
  techStack: string[];
  highlights: string[];
  links: {
    github?: string;
    demo?: string;
    docs?: string;
  };
  thumbnail?: string;
  category: "frontend" | "fullstack" | "backend" | "other";

  // 증거 기반 필드 (블로그 글 조언 반영)
  problemSolving?: ProblemSolving[];
  techDecisions?: TechDecision[];
  retrospective?: string; // 회고 블로그 링크
}

// 프로젝트 데이터 (실제 프로젝트로 교체하세요)
export const PROJECTS: Project[] = [
  {
    id: "knowledge-garden",
    title: "Engineering Knowledge Garden",
    description: "개발자의 학습 여정을 시각화하는 인터랙티브 포트폴리오",
    period: "2025.01 - 현재",
    role: "Frontend Developer",
    techStack: [
      "Next.js 15",
      "TypeScript",
      "Tailwind CSS 4",
      "Recharts",
      "Lucide",
    ],
    highlights: [
      "GitHub API 연동으로 실시간 커밋 히트맵 시각화",
      "레이더 차트를 활용한 역량 분포도 구현",
      "로컬 Obsidian 마크다운 데이터 기반 지식 그래프 시뮬레이션",
      "Framer Motion을 활용한 부드러운 인터랙션 설계",
    ],
    links: {
      github: "https://github.com/ssyy3034/my-knowledge-garden",
      demo: "https://kwon-dongha-portfolio.vercel.app",
    },
    category: "frontend",
    problemSolving: [
      {
        challenge: "GitHub GraphQL API 호출 시 CORS 및 인증 문제",
        approach: "서버 컴포넌트에서 API 호출하고 환경변수로 토큰 관리",
        result: "클라이언트 노출 없이 안전하게 GitHub 데이터 연동",
      },
      {
        challenge: "실시간성 확보와 로컬 데이터 연동의 조화",
        approach: "Node.js fs와 glob을 활용한 정적 분석 엔진 구축",
        result: "로컬 환경의 기록이 실시간으로 정원에 반영됨",
      },
    ],
    techDecisions: [
      {
        tech: "Next.js 15 App Router",
        reason: "강력한 서버 사이드 렌더링 성능과 API Route 보안성 확보",
      },
      {
        tech: "Recharts & React Calendar Heatmap",
        reason: "가볍고 선명한 2D 데이터 시각화를 위해 선정",
      },
    ],
  },
  {
    id: "stolink",
    title: "StoLink",
    description: "웹 소설 작가를 위한 세계관 설정 및 관계도 시각화 플랫폼",
    period: "2024.11 - 2024.12",
    role: "Frontend Sole Developer",
    techStack: [
      "React 19",
      "TypeScript",
      "Zustand",
      "TanStack Query",
      "D3.js",
      "Canvas API",
      "Tiptap",
    ],
    highlights: [
      "SVG 기반 그래프를 Canvas로 마이그레이션하여 렌더링 성능 16배 개선",
      "TanStack Query와 Zustand를 연동하여 낙관적 업데이트 구현",
      "AI 에이전트 기반 개발 워크플로우 자동화 도입",
    ],
    links: {},
    category: "frontend",
    problemSolving: [
      {
        challenge: "DOM 기반 SVG 렌더링의 성능 한계 (노드 30개 시 10FPS)",
        approach: "Canvas API 전환 및 텍스처 캐싱, 단일 레이어 렌더링 적용",
        result: "노드 600개 이상에서도 60FPS 유지, INP 16배 개선",
      },
      {
        challenge: "서버 응답 대기에 따른 UI 반응성 저하",
        approach: "낙관적 업데이트(Optimistic Updates) 및 자동 롤백 전략 적용",
        result: "네이티브 앱 수준의 즉각적인 반응성 확보 (체감 지연 0ms)",
      },
    ],
    techDecisions: [
      {
        tech: "TanStack Query & Zustand",
        reason:
          "서버 상태와 클라이언트 상태를 분리하고, 캐싱 전략 및 낙관적 업데이트를 적용하여 즉각적인 피드백 구현",
      },
      {
        tech: "D3.js & Canvas API",
        reason: "대규모 노드 데이터의 실시간 시각화 및 물리 엔진 시뮬레이션",
      },
    ],
  },
];

export function getProjectById(id: string): Project | undefined {
  return PROJECTS.find((p) => p.id === id);
}

export function getProjectsByCategory(
  category: Project["category"],
): Project[] {
  return PROJECTS.filter((p) => p.category === category);
}
