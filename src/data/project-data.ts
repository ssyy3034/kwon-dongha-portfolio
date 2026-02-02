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
    id: "stolink",
    title: "StoLink",
    description: "웹 소설 작가를 위한 세계관 설정 및 관계도 시각화 플랫폼",
    period: "2025.12 - 2026.01",
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
      "SVG 기반 그래프를 Canvas로 마이그레이션하여 렌더링 성능 16.3배 개선",
      "TanStack Query와 Zustand를 연동하여 낙관적 업데이트 구현",
      "AI 에이전트 기반 개발 워크플로우 자동화 도입",
    ],
    links: {},
    category: "frontend",
    problemSolving: [
      {
        challenge: "DOM 기반 SVG 렌더링의 성능 한계 (노드 30개 시 10FPS)",
        approach: "Canvas API 전환 및 텍스처 캐싱, 단일 레이어 렌더링 적용",
        result: "노드 600개 이상에서도 60FPS 유지, INP 16.3배 개선",
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
