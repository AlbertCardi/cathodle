import { comparePeriods, feastDayToDate } from "@/lib/utils";
import React, { useState, useEffect } from "react";

type AnimatedCellProps = {
  children: React.ReactNode;
  delay: number;
  className: string;
};

type AnimatedGuessTableProps = {
  guesses: Saint[];
  targetSaint: Saint;
  getCellStyle: (value1: string, value2: string, field?: string) => string;
  getTypeColor: (type: SaintType) => string;
};

const AnimatedCell = ({ children, delay, className }: AnimatedCellProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <td
      className={`${className} transition-all duration-300 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      {children}
    </td>
  );
};

const AnimatedGuessTable = ({
  guesses,
  targetSaint,
  getCellStyle,
  getTypeColor,
}: AnimatedGuessTableProps) => {
  const CELL_DELAY = 200; // Délai entre chaque cellule en millisecondes

  return (
    <div className="w-full overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-900">
            <th className="p-4 text-left font-semibold text-gray-700 dark:text-gray-200">
              Nom
            </th>
            <th className="p-4 text-left font-semibold text-gray-700 dark:text-gray-200">
              Genre
            </th>
            <th className="p-4 text-left font-semibold text-gray-700 dark:text-gray-200">
              Période
            </th>
            <th className="p-4 text-left font-semibold text-gray-700 dark:text-gray-200">
              Origine
            </th>
            <th className="p-4 text-left font-semibold text-gray-700 dark:text-gray-200">
              Rôle
            </th>
            <th className="p-4 text-left font-semibold text-gray-700 dark:text-gray-200">
              Patronage
            </th>
            <th className="p-4 text-left font-semibold text-gray-700 dark:text-gray-200">
              Attributs
            </th>
            <th className="p-4 text-left font-semibold text-gray-700 dark:text-gray-200">
              Canonisation
            </th>
            <th className="p-4 text-left font-semibold text-gray-700 dark:text-gray-200">
              Fête
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {guesses.map((guess, rowIndex) => (
            <tr
              key={`guess-${guess.name}-${rowIndex}`}
              className="border-t border-gray-200 dark:border-gray-700"
            >
              <AnimatedCell
                delay={0}
                className={`p-4 ${getCellStyle(
                  guess.name,
                  targetSaint?.name || ""
                )}`}
              >
                <div className="flex flex-1 gap-x-[10px] items-center">
                  <div className="flex items-center flex-row flex-1">
                    {guess.name}
                    <span
                      className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(
                        guess.type as SaintType
                      )}`}
                    >
                      {guess.type}
                    </span>
                  </div>
                </div>
              </AnimatedCell>

              <AnimatedCell
                delay={rowIndex === 0 ? CELL_DELAY : 0}
                className={`p-4 ${getCellStyle(
                  guess.gender,
                  targetSaint.gender
                )}`}
              >
                {guess.gender}
              </AnimatedCell>

              <AnimatedCell
                delay={rowIndex === 0 ? 2 * CELL_DELAY : 0}
                className={`p-4 ${getCellStyle(
                  guess.period,
                  targetSaint.period,
                  "period"
                )}`}
              >
                <span className="flex items-center justify-between">
                  {guess.period}
                  {guess.period !== targetSaint.period && (
                    <span className="ml-2 dark:text-gray-200">
                      {comparePeriods(guess.period, targetSaint.period) < 0
                        ? "↑"
                        : "↓"}
                    </span>
                  )}
                </span>
              </AnimatedCell>

              <AnimatedCell
                delay={rowIndex === 0 ? 3 * CELL_DELAY : 0}
                className={`p-4 ${getCellStyle(
                  guess.origin,
                  targetSaint.origin
                )}`}
              >
                {guess.origin}
              </AnimatedCell>

              <AnimatedCell
                delay={rowIndex === 0 ? 4 * CELL_DELAY : 0}
                className={`p-4 ${getCellStyle(guess.role, targetSaint.role)}`}
              >
                {guess.role}
              </AnimatedCell>

              <AnimatedCell
                delay={rowIndex === 0 ? 5 * CELL_DELAY : 0}
                className={`p-4 ${getCellStyle(
                  guess.patronage,
                  targetSaint.patronage,
                  "patronage"
                )}`}
              >
                {guess.patronage}
              </AnimatedCell>

              <AnimatedCell
                delay={rowIndex === 0 ? 6 * CELL_DELAY : 0}
                className={`p-4 ${getCellStyle(
                  guess.attributes,
                  targetSaint.attributes,
                  "attributes"
                )}`}
              >
                {guess.attributes}
              </AnimatedCell>

              <AnimatedCell
                delay={rowIndex === 0 ? 7 * CELL_DELAY : 0}
                className={`p-4 ${getCellStyle(
                  guess.canonization,
                  targetSaint.canonization
                )}`}
              >
                {guess.canonization}
              </AnimatedCell>

              <AnimatedCell
                delay={rowIndex === 0 ? 8 * CELL_DELAY : 0}
                className={`p-4 ${getCellStyle(
                  guess.feastDay,
                  targetSaint.feastDay,
                  "feastDay"
                )}`}
              >
                <span className="flex items-center justify-between">
                  {guess.feastDay}
                  {guess.feastDay !== "Aucun" &&
                    guess.feastDay !== targetSaint.feastDay && (
                      <span className="ml-2 dark:text-gray-200">
                        {feastDayToDate(guess.feastDay) <
                        feastDayToDate(targetSaint.feastDay)
                          ? "↑"
                          : "↓"}
                      </span>
                    )}
                </span>
              </AnimatedCell>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AnimatedGuessTable;
