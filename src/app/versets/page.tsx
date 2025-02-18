"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { gameStorage } from "@/lib/gameStorage";
import { compareDates, getCurrentDate } from "@/lib/utils";
import BibleReferenceDropdown from "@/components/BibleReferenceDropdown";
import { ChevronUp, ChevronDown, CheckCircle, XCircle } from "lucide-react";
import VERSES from "@/constants/verses.json";

// Utility functions remain the same
const getCurrentDayVerse = (): TargetVerse => {
  const currentDate = new Date(getCurrentDate());
  const timestamp = currentDate.getTime();
  const bookIndex = timestamp % VERSES.length;

  const book = VERSES[bookIndex];
  const chapterIndex = timestamp % book.chapters.length;
  const chapter = book.chapters[chapterIndex];
  const verseIndex = timestamp % chapter.length;

  return {
    book: book.name,
    chapter: chapterIndex + 1,
    verse: verseIndex + 1,
    text: chapter[verseIndex],
    reference: `${book.name} ${chapterIndex + 1}:${verseIndex + 1}`,
    input: `${book?.abbrev} ${chapterIndex + 1}:${verseIndex + 1}`,
  };
};

const getVerseText = (reference: string): string | null => {
  const [bookAbbrev, chapterVerse] = reference.split(" ");
  const [chapter, verse] = chapterVerse.split(":").map(Number);

  const book = VERSES.find((b) => b.abbrev === bookAbbrev);
  if (!book) return null;

  return book.chapters[chapter - 1]?.[verse - 1] ?? null;
};

const parseReference = (reference: string) => {
  const [book, chapterVerse] = reference.split(" ");
  const [chapter, verse] = chapterVerse.split(":").map(Number);
  return { book, chapter, verse };
};

const getGuessFeedback = (guess: string, target: string): GuessFeedback => {
  const guessRef = parseReference(guess);
  const targetRef = parseReference(target);

  // Trouver les livres complets pour avoir accès aux informations supplémentaires
  const guessBook = VERSES.find((b) => b.abbrev === guessRef.book);
  const targetBook = VERSES.find((b) => b.abbrev === targetRef.book);

  if (!guessBook || !targetBook) {
    throw new Error("Livre non trouvé");
  }

  const testamentFeedback = {
    value: guessBook.canon as "Ancient Testament" | "Nouveau Testament",
    isCorrect: guessBook.canon === targetBook.canon,
  };

  const groupFeedback = {
    value: guessBook.group,
    isCorrect: guessBook.group === targetBook.group,
    hasCommonGroup: guessBook.group === targetBook.group,
  };

  if (guessRef.book !== targetRef.book) {
    return {
      bookStatus: false,
      chapterHint: null,
      verseHint: null,
      statusText: "",
      testament: testamentFeedback,
      group: groupFeedback,
    };
  }

  if (guessRef.chapter !== targetRef.chapter) {
    return {
      bookStatus: true,
      chapterHint: guessRef.chapter < targetRef.chapter ? "up" : "down",
      verseHint: null,
      statusText: `Chapitre ${
        guessRef.chapter < targetRef.chapter ? "plus grand" : "plus petit"
      }`,
      testament: testamentFeedback,
      group: groupFeedback,
    };
  }

  if (guessRef.verse !== targetRef.verse) {
    return {
      bookStatus: true,
      chapterHint: "correct",
      verseHint: guessRef.verse < targetRef.verse ? "up" : "down",
      statusText: `Verset ${
        guessRef.verse < targetRef.verse ? "plus grand" : "plus petit"
      }`,
      testament: testamentFeedback,
      group: groupFeedback,
    };
  }

  return {
    bookStatus: true,
    chapterHint: "correct",
    verseHint: "correct",
    statusText: "Correct !",
    testament: testamentFeedback,
    group: groupFeedback,
  };
};

export default function VersetsPage() {
  const [targetVerse, setTargetVerse] = useState<TargetVerse | null>(null);
  const [guesses, setGuesses] = useState<VerseGuess[]>([]);
  const [gameWon, setGameWon] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [incorrectGuesses, setIncorrectGuesses] = useState(0);

  useEffect(() => {
    const initializeGame = () => {
      if (gameStorage.hasVerseGame()) {
        const savedState = gameStorage.loadVerseGameState();

        if (compareDates(savedState.currentDay, getCurrentDate()) >= 0) {
          setTargetVerse(savedState.targetVerse);
          setGuesses(savedState.guesses);
          setGameWon(savedState.won);
          setIncorrectGuesses(savedState.incorrectGuesses);
          return;
        }
      }

      const newTargetVerse = getCurrentDayVerse();
      setTargetVerse(newTargetVerse);
      gameStorage.saveVerseGameState({
        targetVerse: newTargetVerse,
        guesses: [],
        won: false,
        currentDay: getCurrentDate(),
        incorrectGuesses: 0,
      });
    };

    initializeGame();
  }, []);

  useEffect(() => {
    if (targetVerse) {
      gameStorage.saveVerseGameState({
        targetVerse,
        guesses,
        won: gameWon,
        currentDay: getCurrentDate(),
        incorrectGuesses,
      });
    }
  }, [targetVerse, guesses, gameWon, incorrectGuesses]);

  const handleGuess = (guessReference: string) => {
    const guessText = getVerseText(guessReference);

    if (!guessText) {
      triggerShake();
      return;
    }

    const feedback = getGuessFeedback(guessReference, targetVerse!.input);
    const { book: bookAbbrev, chapter, verse } = parseReference(guessReference);
    const book = VERSES.find((e) => e.abbrev === bookAbbrev);
    const newGuess: VerseGuess = {
      reference: `${bookAbbrev} ${chapter}:${verse}`,
      input: `${book?.name} ${chapter}:${verse}`,
      text: guessText,
      feedback,
    };

    if (guessReference === targetVerse?.reference) {
      setGameWon(true);
    } else {
      setIncorrectGuesses(incorrectGuesses + 1);
    }

    setGuesses([newGuess, ...guesses]);
  };

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => {
      setIsShaking(false);
    }, 820);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            Devine le Verset
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Trouvez le verset mystère à partir de son contenu !
          </p>
        </div>

        {/* Target verse display */}
        <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
          <p className="text-lg text-gray-700 dark:text-gray-200 text-center italic">
            {targetVerse && `"${targetVerse?.text}"`}
          </p>
        </div>

        {!gameWon && (
          <div className="mb-8">
            <BibleReferenceDropdown
              verseData={VERSES}
              onSubmit={handleGuess}
              isShaking={isShaking}
              usedVerses={guesses.map((guess) => guess.reference)}
            />
          </div>
        )}

        {gameWon && (
          <div className="mb-8 p-6 bg-emerald-100 dark:bg-emerald-900 rounded-xl shadow-lg text-center">
            <h2 className="text-2xl font-bold text-emerald-800 dark:text-emerald-200 mb-2">
              Félicitations !
            </h2>
            <p className="text-emerald-700 dark:text-emerald-300 mb-4">
              Vous avez trouvé le verset en {guesses.length} essai
              {guesses.length > 1 ? "s" : ""} !
            </p>
            <p className="text-emerald-700 dark:text-emerald-300 font-semibold">
              {targetVerse?.reference}
            </p>
          </div>
        )}

        {/* Previous guesses */}
        {guesses.length > 0 && (
          <div className="space-y-4">
            {guesses.map((guess, index) => (
              <div
                key={index}
                className="p-4 rounded-lg shadow bg-white dark:bg-gray-800"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-700 dark:text-gray-200 mb-1 flex items-center gap-2">
                        {guess.input}
                        <span className="flex items-center gap-1">
                          {guess.feedback.bookStatus ? (
                            <CheckCircle className="text-emerald-500 dark:text-emerald-400 w-5 h-5" />
                          ) : (
                            <XCircle className="text-red-500 dark:text-red-400 w-5 h-5" />
                          )}
                          {guess.feedback.chapterHint === "up" && (
                            <ChevronUp className="text-orange-500 dark:text-orange-400" />
                          )}
                          {guess.feedback.chapterHint === "down" && (
                            <ChevronDown className="text-orange-500 dark:text-orange-400" />
                          )}
                          {guess.feedback.verseHint === "up" && (
                            <ChevronUp className="text-orange-500 dark:text-orange-400" />
                          )}
                          {guess.feedback.verseHint === "down" && (
                            <ChevronDown className="text-orange-500 dark:text-orange-400" />
                          )}
                        </span>
                      </p>
                      <div className="flex gap-2 text-sm">
                        <span
                          className={`px-2 py-1 rounded-full ${
                            guess.feedback.testament.isCorrect
                              ? "bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300"
                              : "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300"
                          }`}
                        >
                          {guess.feedback.testament.value === "Ancien Testament"
                            ? "Ancien Testament"
                            : "Nouveau Testament"}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full ${
                            guess.feedback.group.isCorrect
                              ? "bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300"
                              : guess.feedback.group.hasCommonGroup
                              ? "bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300"
                              : "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300"
                          }`}
                        >
                          {guess.feedback.group.value}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {guess.feedback.statusText}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t dark:border-gray-700">
                    <p className="text-gray-700 dark:text-gray-300 italic">{`"${guess.text}"`}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {gameWon && (
          <div className="flex justify-center mt-6 gap-4">
            <Link
              href="/"
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-800 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
            >
              Retour aux Saints
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
