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
    period: "2025.12 - 2026.02",
    role: "Frontend Sole Developer",
    techStack: [
      "React 19",
      "TypeScript",
      "Zustand",
      "TanStack Query",
      "react-force-graph-2d",
      "Canvas API",
      "Tiptap",
    ],
    highlights: [
      "DOM 기반 SVG 렌더링을 Canvas 이벤트 위임 모델로 마이그레이션하여 대규모 데이터에서도 60FPS 방어",
      "TanStack Query와 Zustand를 연동하여 낙관적 업데이트 구현",
      "AI 에이전트 기반 개발 워크플로우 자동화 도입",
    ],
    links: {},
    category: "frontend",
    problemSolving: [
      {
        challenge:
          "노드/엣지별 개별 SVG DOM 이벤트 핸들러 부착으로 인한 렌더링 부하 증가 (노드 600개 이상 시 프레임 드랍)",
        approach:
          "단일 Canvas 레이어 렌더링으로 전환하고, react-force-graph-2d의 nodePointerAreaPaint로 클릭 영역을 커스텀 정의하여 라이브러리의 이벤트 위임 구조 위에서 인터랙션 처리",
        result:
          "수천 개의 DOM 노드 유지 비용을 제거하여 600명 이상의 인물 관계망에서도 60FPS 안정적 유지",
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
        tech: "Canvas API & Raycasting",
        reason:
          "대규모 노드/엣지 환경에서 DOM 유지 비용을 최소화하고 렌더링 엔진 부하 완화",
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
