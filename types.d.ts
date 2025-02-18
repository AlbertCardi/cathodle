type Saint = {
  name: string;
  period: string;
  origin: string;
  role: string;
  patronage: string;
  attributes: string;
  canonization: string;
  gender: string;
  feastDay: string;
  type: string;
};

type SaintType =
  | "Biblique"
  | "Ancien"
  | "Médiéval"
  | "Moderne"
  | "Contemporain";

interface TargetVerse {
  book: string; // Nom du livre (ex: "Genèse")
  chapter: number; // Numéro du chapitre
  verse: number; // Numéro du verset
  text: string; // Texte du verset
  reference: string; // Format complet "Livre Chapitre:Verset"
  input: string;
}

type Book = {
  name: string;
  abbrev: string;
  group: string;
  canon: string;
  chapters: Array<string[]>;
};

interface VerseGuess {
  reference: string;
  input: string;
  text: string;
  feedback: GuessFeedback;
}

interface GuessFeedback {
  bookStatus: boolean;
  chapterHint: "up" | "down" | "correct" | null;
  verseHint: "up" | "down" | "correct" | null;
  statusText: string;
  testament: {
    value: string;
    isCorrect: boolean;
  };
  group: {
    value: string;
    isCorrect: boolean;
    hasCommonGroup: boolean;
  };
}

declare module "@/constants/verses.json" {
  const verses: Book[];
  export default verses;
}
