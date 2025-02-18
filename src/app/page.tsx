"use client";
import React, { useState, useEffect } from "react";
import SAINTS from "@/constants/saints.json";
import {
  compareDates,
  feastDayToDate,
  getCurrentDate,
  hasCommonElement,
  normalizeString,
} from "@/lib/utils";
import SearchAutocomplete from "@/components/SearchAutoComplete";
import AnimatedGuessTable from "@/components/AnimatedGuessTable";
import Link from "next/link";
import { gameStorage } from "@/lib/gameStorage";

export default function Home() {
  const [targetSaint, setTargetSaint] = useState<Saint | null>(null);
  const [guesses, setGuesses] = useState<Saint[]>([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [gameWon, setGameWon] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [incorrectGuesses, setIncorrectGuesses] = useState(0);

  // Load game state from cookies on initial render
  useEffect(() => {
    const initializeGame = () => {
      if (gameStorage.hasVerseGame()) {
        const savedState = gameStorage.loadSaintGameState();

        if (compareDates(savedState.currentDay, getCurrentDate()) >= 0) {
          setTargetSaint(savedState.targetSaint);
          setGuesses(savedState.guesses);
          setGameWon(savedState.currentStep !== 0);
          setIncorrectGuesses(savedState.incorrectGuesses);
        }
      }
      const currentDate = new Date(getCurrentDate());
      const timestamp = currentDate.getTime();
      const index = timestamp % SAINTS.length;
      const newTargetSaint = SAINTS[index];
      setTargetSaint(newTargetSaint);
      gameStorage.saveTargetSaint(newTargetSaint);
    };

    initializeGame();
  }, []);

  // Save game state to cookies whenever it changes
  useEffect(() => {
    if (targetSaint) {
      gameStorage.saveSaintGameState({
        targetSaint,
        guesses,
        currentStep: gameWon ? 1 : 0,
        currentDay: getCurrentDate(),
        incorrectGuesses,
      });
    }
  }, [targetSaint, guesses, gameWon, incorrectGuesses]);

  const handleGuess = (guessValue: string) => {
    if (!guessValue.trim()) {
      return;
    }

    const guess = SAINTS.find(
      (s) => normalizeString(s.name) === normalizeString(guessValue)
    );

    if (!guess) {
      triggerShake();
      return;
    }

    if (guess.name === targetSaint?.name) {
      setGameWon(true);
    } else {
      setIncorrectGuesses(incorrectGuesses + 1);
    }

    setGuesses([guess, ...guesses]);
    setCurrentGuess("");
  };

  const handleSaintSelect = (saintName: string) => {
    setCurrentGuess(saintName);
  };

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => {
      setIsShaking(false);
    }, 820);
  };

  const getTypeColor = (type: SaintType) => {
    const colors = {
      Biblique:
        "bg-violet-200 dark:bg-violet-800 text-violet-800 dark:text-violet-200",
      Ancien:
        "bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200",
      Médiéval:
        "bg-emerald-200 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-200",
      Moderne:
        "bg-orange-200 dark:bg-orange-800 text-orange-800 dark:text-orange-200",
      Contemporain:
        "bg-rose-200 dark:bg-rose-800 text-rose-800 dark:text-rose-200",
    };
    return (
      colors[type] ||
      "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
    );
  };

  const getCellStyle = (value1: string, value2: string, field?: string) => {
    if (!value1 || !value2)
      return "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200";

    if (field === "feastDay") {
      if (value1 === "Aucun" || value2 === "Aucun") {
        if (value1 === value2) {
          return "bg-emerald-500 dark:bg-emerald-700 text-white";
        }
        return "bg-red-500 dark:bg-red-700 text-white flex-1";
      }

      const date1 = feastDayToDate(value1);
      const date2 = feastDayToDate(value2);

      if (date1.getTime() === date2.getTime()) {
        return "bg-emerald-500 dark:bg-emerald-700 text-white";
      }

      return "bg-red-500 dark:bg-red-700 text-white flex-1";
    }

    if (field === "attributes" || field === "patronage") {
      if (normalizeString(value1) === normalizeString(value2)) {
        return "bg-emerald-500 dark:bg-emerald-700 text-white";
      }
      if (hasCommonElement(value1, value2)) {
        return "bg-orange-500 dark:bg-orange-700 text-white";
      }
      return "bg-red-500 dark:bg-red-700 text-white";
    }

    if (normalizeString(value1) === normalizeString(value2)) {
      return "bg-emerald-500 dark:bg-emerald-700 text-white";
    }

    const words1 = normalizeString(value1)
      .split(",")
      .map((w) => w.trim());
    const words2 = normalizeString(value2)
      .split(",")
      .map((w) => w.trim());
    const hasPartialMatch = words1.some((w1) =>
      words2.some((w2) => w2.includes(w1) || w1.includes(w2))
    );

    if (hasPartialMatch) {
      return "bg-yellow-500 dark:bg-yellow-700 text-white";
    }

    return "bg-red-500 dark:bg-red-700 text-white";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            Devine le Saint
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Devinez le saint mystère en utilisant les indices !
          </p>
        </div>

        {!gameWon ? (
          <div className="mb-8">
            <div className="flex gap-4 justify-center mb-4">
              <SearchAutocomplete
                saints={SAINTS}
                value={currentGuess}
                onChange={setCurrentGuess}
                onSelect={handleSaintSelect}
                onSubmit={handleGuess}
                isShaking={isShaking}
                getTypeColor={getTypeColor}
                triggerShake={triggerShake}
                guessedSaints={guesses.map((e) => e.name)}
              />
            </div>
          </div>
        ) : (
          <div className="mb-8 p-6 bg-emerald-100 dark:bg-emerald-900 rounded-xl shadow-lg text-center">
            <h2 className="text-2xl font-bold text-emerald-800 dark:text-emerald-200 mb-2">
              Félicitations !
            </h2>
            <p className="text-emerald-700 dark:text-emerald-300 mb-4">
              Vous avez trouvé le saint en {guesses.length} essai
              {guesses.length > 1 ? "s" : ""} !
            </p>
            <div className="text-emerald-700 dark:text-emerald-300">
              <p className="font-semibold text-lg">Saint {targetSaint!.name}</p>
              <p>Fêté le {targetSaint!.feastDay}</p>
              <p>Saint patron : {targetSaint!.patronage}</p>
              <p>Attributs : {targetSaint!.attributes}</p>
            </div>
          </div>
        )}

        {guesses.length > 0 && (
          <AnimatedGuessTable
            guesses={guesses}
            targetSaint={targetSaint!}
            getCellStyle={getCellStyle}
            getTypeColor={getTypeColor}
          />
        )}

        {gameWon && (
          <div className="flex justify-center mt-6 gap-4">
            <Link
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-800 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
              href={`/versets`}
            >
              Devine le verset
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
