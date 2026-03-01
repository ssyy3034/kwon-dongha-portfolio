export interface ProblemSolution {
  id: string;
  title: string;
  subtitle?: string;
  // 4단계 스토리텔링
  problem: string;         // 문제 발견 및 정의
  approach: string;        // 해결방법 모색 및 결정
  result: string;          // 적용 및 개선 결과
  retrospective?: string;  // 아쉬운점 및 개선 가능한 점
  // 보조 자료
  details?: string[];
  codeSnippet?: string;
  diagram?: {
    type: "mermaid" | "image";
    content: string;
    caption?: string;
  };
  impact?: string;
}

export interface Achievement {
  metric?: string;
  label: string;
  description: string;
}

export interface ProjectDetail {
  id: string;
  tagline: string;
  overview: string;
  sections: {
    backend?: ProblemSolution[];
    frontend?: ProblemSolution[];
  };
  achievements: Achievement[];
  techStack: {
    category: string;
    items: string[];
  }[];
}
