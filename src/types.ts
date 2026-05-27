export type Question = {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  topic?: string;
  explanation?: string;
  image?: string;
  imageAlt?: string;
};

export type QuestionBank = {
  questionsPerSession?: number;
  questions: Question[];
};

export type ShuffledOption = {
  text: string;
  originalIndex: number;
};

export type SessionQuestion = {
  question: Question;
  shuffledOptions: ShuffledOption[];
  selectedShuffledIndex: number | null;
  checked: boolean;
};

export type Screen = 'idle' | 'in_progress' | 'finished';
