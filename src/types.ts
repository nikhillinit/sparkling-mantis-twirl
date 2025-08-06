export interface User {
  name: string;
  goal: string;
  onboardingComplete: boolean;
  diagnosticComplete: boolean;
}

export interface Progress {
  moduleId: string;
  lessonsCompleted: number;
  totalLessons: number;
  practiceCompleted: boolean;
  quizCompleted: boolean;
}

export interface DiagnosticResult {
  questionId: string;
  module: string;
  selectedAnswer: number;
  correct: boolean;
}

export interface ACFData {
  user: User | null;
  progress: Progress[];
  diagnosticResults: DiagnosticResult[];
}