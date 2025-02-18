"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { gameStorage } from "@/lib/gameStorage";
import { compareDates, getCurrentDate } from "@/lib/utils";
import BibleReferenceDropdown from "@/components/BibleReferenceDropdown";
import { ChevronUp, ChevronDown, CheckCircle, XCircle } from "lucide-react";
import VERSES from "@/constants/verses.json";

// Utility to get a random verse from the data
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
  };
};

const getVerseText = (reference: string): string | null => {
  const [bookName, chapterVerse] = reference.split(" ");
  const [chapter, verse] = chapterVerse.split(":").map(Number);

  const book = VERSES.find((b) => b.name === bookName);
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

  // Vérifier le livre
  if (guessRef.book !== targetRef.book) {
    return {
      bookStatus: false,
      chapterHint: null,
      verseHint: null,
      statusText: "Mauvais livre",
    };
  }

  // Si le livre est correct, vérifier le chapitre
  if (guessRef.chapter !== targetRef.chapter) {
    return {
      bookStatus: true,
      chapterHint: guessRef.chapter < targetRef.chapter ? "up" : "down",
      verseHint: null,
      statusText: `Chapitre ${
        guessRef.chapter < targetRef.chapter ? "plus grand" : "plus petit"
      }`,
    };
  }

  // Si livre et chapitre corrects, vérifier le verset
  if (guessRef.verse !== targetRef.verse) {
    return {
      bookStatus: true,
      chapterHint: "correct",
      verseHint: guessRef.verse < targetRef.verse ? "up" : "down",
      statusText: `Verset ${
        guessRef.verse < targetRef.verse ? "plus grand" : "plus petit"
      }`,
    };
  }

  // Tout est correct
  return {
    bookStatus: true,
    chapterHint: "correct",
    verseHint: "correct",
    statusText: "Correct !",
  };
};

export default function VersetsPage() {
  const [targetVerse, setTargetVerse] = useState<TargetVerse | null>(null);
  const [guesses, setGuesses] = useState<VerseGuess[]>([]);
  const [gameWon, setGameWon] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [incorrectGuesses, setIncorrectGuesses] = useState(0);

  // Initialize game state
  useEffect(() => {
    console.log("allo");
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

      console.log("init");
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

  // Save game state when it changes
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

    console.log(guessText, "before:", guessReference);
    if (!guessText) {
      triggerShake();
      return;
    }

    const feedback = getGuessFeedback(guessReference, targetVerse!.reference);

    const newGuess: VerseGuess = {
      reference: guessReference,
      text: guessText,
      feedback,
    };

    if (guessReference === targetVerse?.reference) {
      setGameWon(true);
    } else {
      setIncorrectGuesses(incorrectGuesses + 1);
    }

    console.log("new guess:", newGuess);
    setGuesses([newGuess, ...guesses]);
  };

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => {
      setIsShaking(false);
    }, 820);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Devine le Verset
          </h1>
          <p className="text-gray-600 text-lg">
            Trouvez le verset mystère à partir de son contenu !
          </p>
        </div>

        {/* Target verse display */}
        <div className="mb-8 p-6 bg-white rounded-xl shadow-lg">
          <p className="text-lg text-gray-700 text-center italic">
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
          <div className="mb-8 p-6 bg-emerald-100 rounded-xl shadow-lg text-center">
            <h2 className="text-2xl font-bold text-emerald-800 mb-2">
              Félicitations !
            </h2>
            <p className="text-emerald-700 mb-4">
              Vous avez trouvé le verset en {guesses.length} essai
              {guesses.length > 1 ? "s" : ""} !
            </p>
            <p className="text-emerald-700 font-semibold">
              {targetVerse?.reference}
            </p>
          </div>
        )}

        {/* Previous guesses */}
        {guesses.length > 0 && (
          <div className="space-y-4">
            {guesses.map((guess, index) => (
              <div key={index} className="p-4 rounded-lg shadow bg-white">
                <div className="space-y-2">
                  {/* Reference and feedback */}
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-700 mb-1 flex items-center gap-2">
                        {guess.reference}
                        <span className="flex items-center gap-1">
                          {guess.feedback.bookStatus ? (
                            <CheckCircle className="text-emerald-500 w-5 h-5" />
                          ) : (
                            <XCircle className="text-red-500 w-5 h-5" />
                          )}
                          {guess.feedback.chapterHint === "up" && (
                            <ChevronUp className="text-orange-500" />
                          )}
                          {guess.feedback.chapterHint === "down" && (
                            <ChevronDown className="text-orange-500" />
                          )}
                          {guess.feedback.verseHint === "up" && (
                            <ChevronUp className="text-orange-500" />
                          )}
                          {guess.feedback.verseHint === "down" && (
                            <ChevronDown className="text-orange-500" />
                          )}
                        </span>
                      </p>
                      <p className="text-sm text-gray-600">
                        {guess.feedback.statusText}
                      </p>
                    </div>
                  </div>

                  {/* Verse text */}
                  <div className="pt-2 border-t">
                    <p className="text-gray-700 italic">{`"${guess.text}"`}</p>
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
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
            >
              Retour aux Saints
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
