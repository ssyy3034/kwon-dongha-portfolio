// 프로젝트 상세 페이지용 타입 정의

export interface TechDecision {
  category: string;
  items: string[];
}

export interface ProblemSolution {
  id: string;
  title: string;
  subtitle?: string;
  challenge: string;
  solution: string;
  details?: string[];
  codeExample?: {
    language: string;
    code: string;
    caption?: string;
  };
  diagram?: {
    type: "mermaid" | "image";
    content: string;
    caption?: string;
  };
  impact?: string;
}

export interface KeyFocus {
  headline: string;
  points: {
    icon: "layers" | "zap" | "shield" | "target" | "cpu" | "database";
    title: string;
    description: string;
  }[];
}

export interface Achievement {
  metric?: string;
  label: string;
  description: string;
}

export interface Decision {
  id: string;
  type: "initial" | "development";
  decision: string;
  reason: string;
  result?: string;
}

export interface ProjectDetail {
  id: string;
  // 확장된 개요
  tagline: string; // 한 줄 요약 (인용문 스타일)
  overview: string; // 상세 개요

  // 핵심 포커스 (선택적 - 주요 프로젝트용)
  keyFocus?: KeyFocus;

  // 기술적 의사 결정 (ADR 요약)
  decisions?: Decision[];

  // 문제 해결 섹션들
  sections: ProblemSolution[];

  // 성과
  achievements: Achievement[];

  // 기술 스택 상세
  techStack: TechDecision[];
}
