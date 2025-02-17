import Cookies from "js-cookie";
import { getCurrentDate } from "./utils";

const COOKIE_EXPIRATION = 1; // days

// Saint game cookies
const SAINT_COOKIE_PREFIX = "saint_game_";
const SAINT_COOKIE_NAMES = {
  currentDay: `${SAINT_COOKIE_PREFIX}currentDay`,
  targetSaint: `${SAINT_COOKIE_PREFIX}target`,
  guesses: `${SAINT_COOKIE_PREFIX}guesses`,
  currentStep: `${SAINT_COOKIE_PREFIX}currentStep`,
  incorrectGuesses: `${SAINT_COOKIE_PREFIX}incorrect`,
} as const;

// Verse game cookies
const VERSE_COOKIE_PREFIX = "verse_game_";
const VERSE_COOKIE_NAMES = {
  currentDay: `${VERSE_COOKIE_PREFIX}currentDay`,
  targetVerse: `${VERSE_COOKIE_PREFIX}target`,
  guesses: `${VERSE_COOKIE_PREFIX}guesses`,
  won: `${VERSE_COOKIE_PREFIX}won`,
  incorrectGuesses: `${VERSE_COOKIE_PREFIX}incorrect`,
} as const;

interface TargetVerse {
  book: string;
  chapter: number;
  verse: number;
  text: string;
  reference: string;
}

interface SaintGameState {
  currentDay: string;
  targetSaint: Saint | null;
  guesses: Saint[];
  currentStep: number;
  incorrectGuesses: number;
}

interface VerseGameState {
  currentDay: string;
  targetVerse: TargetVerse | null;
  guesses: VerseGuess[];
  won: boolean;
  incorrectGuesses: number;
}

export const gameStorage = {
  // Saint game methods
  saveTargetSaint: (saint: Saint) => {
    Cookies.set(SAINT_COOKIE_NAMES.targetSaint, JSON.stringify(saint), {
      expires: COOKIE_EXPIRATION,
    });
  },

  saveSaintGuesses: (guesses: Saint[]) => {
    Cookies.set(SAINT_COOKIE_NAMES.guesses, JSON.stringify(guesses), {
      expires: COOKIE_EXPIRATION,
    });
  },

  saveSaintCurrentStep: (currentStep: number) => {
    Cookies.set(SAINT_COOKIE_NAMES.currentStep, JSON.stringify(currentStep), {
      expires: COOKIE_EXPIRATION,
    });
  },

  saveSaintCurrentDay: (currentDay: string) => {
    Cookies.set(SAINT_COOKIE_NAMES.currentDay, currentDay, {
      expires: COOKIE_EXPIRATION,
    });
  },

  saveSaintIncorrectGuesses: (count: number) => {
    Cookies.set(SAINT_COOKIE_NAMES.incorrectGuesses, count.toString(), {
      expires: COOKIE_EXPIRATION,
    });
  },

  loadSaintGameState: (): SaintGameState => {
    const savedTargetSaint = Cookies.get(SAINT_COOKIE_NAMES.targetSaint);
    const savedCurrentDay = Cookies.get(SAINT_COOKIE_NAMES.currentDay);
    const savedGuesses = Cookies.get(SAINT_COOKIE_NAMES.guesses);
    const savedCurrentStep = Cookies.get(SAINT_COOKIE_NAMES.currentStep);
    const savedIncorrectGuesses = Cookies.get(
      SAINT_COOKIE_NAMES.incorrectGuesses
    );

    return {
      currentDay: savedCurrentDay ? savedCurrentDay : getCurrentDate(),
      targetSaint: savedTargetSaint ? JSON.parse(savedTargetSaint) : null,
      guesses: savedGuesses ? JSON.parse(savedGuesses) : [],
      currentStep: savedCurrentStep ? parseInt(savedCurrentStep) : 0,
      incorrectGuesses: savedIncorrectGuesses
        ? parseInt(savedIncorrectGuesses)
        : 0,
    };
  },

  saveSaintGameState: (state: SaintGameState) => {
    if (state.targetSaint) {
      gameStorage.saveTargetSaint(state.targetSaint);
    }
    if (state.guesses.length > 0) {
      gameStorage.saveSaintGuesses(state.guesses);
    }
    gameStorage.saveSaintCurrentStep(state.currentStep);
    gameStorage.saveSaintIncorrectGuesses(state.incorrectGuesses);
    gameStorage.saveSaintCurrentDay(state.currentDay);
  },

  clearSaintGameState: () => {
    Object.values(SAINT_COOKIE_NAMES).forEach((cookieName) => {
      Cookies.remove(cookieName);
    });
  },

  hasSaintGame: () => {
    return !!Cookies.get(SAINT_COOKIE_NAMES.targetSaint);
  },

  // Verse game methods
  saveTargetVerse: (verse: TargetVerse) => {
    Cookies.set(VERSE_COOKIE_NAMES.targetVerse, JSON.stringify(verse), {
      expires: COOKIE_EXPIRATION,
    });
  },

  saveVerseGuesses: (guesses: VerseGuess[]) => {
    Cookies.set(VERSE_COOKIE_NAMES.guesses, JSON.stringify(guesses), {
      expires: COOKIE_EXPIRATION,
    });
  },

  saveVerseGameWon: (won: boolean) => {
    Cookies.set(VERSE_COOKIE_NAMES.won, JSON.stringify(won), {
      expires: COOKIE_EXPIRATION,
    });
  },

  saveVerseCurrentDay: (currentDay: string) => {
    Cookies.set(VERSE_COOKIE_NAMES.currentDay, currentDay, {
      expires: COOKIE_EXPIRATION,
    });
  },

  saveVerseIncorrectGuesses: (count: number) => {
    Cookies.set(VERSE_COOKIE_NAMES.incorrectGuesses, count.toString(), {
      expires: COOKIE_EXPIRATION,
    });
  },

  loadVerseGameState: (): VerseGameState => {
    const savedTargetVerse = Cookies.get(VERSE_COOKIE_NAMES.targetVerse);
    const savedCurrentDay = Cookies.get(VERSE_COOKIE_NAMES.currentDay);
    const savedGuesses = Cookies.get(VERSE_COOKIE_NAMES.guesses);
    const savedWon = Cookies.get(VERSE_COOKIE_NAMES.won);
    const savedIncorrectGuesses = Cookies.get(
      VERSE_COOKIE_NAMES.incorrectGuesses
    );

    return {
      currentDay: savedCurrentDay ? savedCurrentDay : getCurrentDate(),
      targetVerse: savedTargetVerse ? JSON.parse(savedTargetVerse) : null,
      guesses: savedGuesses ? JSON.parse(savedGuesses) : [],
      won: savedWon ? JSON.parse(savedWon) : false,
      incorrectGuesses: savedIncorrectGuesses
        ? parseInt(savedIncorrectGuesses)
        : 0,
    };
  },

  saveVerseGameState: (state: VerseGameState) => {
    if (state.targetVerse) {
      gameStorage.saveTargetVerse(state.targetVerse);
    }
    if (state.guesses.length > 0) {
      gameStorage.saveVerseGuesses(state.guesses);
    }
    gameStorage.saveVerseGameWon(state.won);
    gameStorage.saveVerseIncorrectGuesses(state.incorrectGuesses);
    gameStorage.saveVerseCurrentDay(state.currentDay);
  },

  clearVerseGameState: () => {
    Object.values(VERSE_COOKIE_NAMES).forEach((cookieName) => {
      Cookies.remove(cookieName);
    });
  },

  hasVerseGame: () => {
    return !!Cookies.get(VERSE_COOKIE_NAMES.targetVerse);
  },
};
