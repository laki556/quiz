import { createContext, useContext, useState, type ReactNode } from "react";

type QuizState = {
  form1: any;
  form2: Record<string, any>;
  form3: Record<string, any>;
  answerType: string;
  audioCount: Record<string, number>;
  timeSpent: Record<string, number>;
};

const QuizContext = createContext<any>(null);

export const QuizProvider = ({ children }: { children: ReactNode }) => {
  const [quiz, setQuiz] = useState<QuizState>({
    form1: {},
    form2: {},
    form3: {},
    answerType: "",
    audioCount: {},
    timeSpent: {},
  });

  return (
    <QuizContext.Provider value={{ quiz, setQuiz }}>
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => useContext(QuizContext);