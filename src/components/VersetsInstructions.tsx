import React, { useState } from "react";
import { X } from "lucide-react";

const VersetsInstructions = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg relative">
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-2 top-2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        aria-label="Fermer les instructions"
      >
        <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
      </button>

      <div className="space-y-4">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
          Comment jouer ?
        </h2>

        <div className="space-y-2">
          <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
            Le but du jeu est de trouver le verset du jour en utilisant les
            indices fournis après chaque essai.
          </p>

          <div className="space-y-1">
            <p className="text-sm sm:text-base font-medium text-gray-800 dark:text-gray-200">
              Les couleurs indiquent :
            </p>
            <ul className="text-sm sm:text-base text-gray-700 dark:text-gray-300 space-y-2">
              <li className="flex items-center gap-2">
                <span className="w-4 h-4 bg-emerald-500 rounded-full"></span>
                <span>Le livre, chapitre ou verset est correct</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-4 h-4 bg-orange-500 rounded-full"></span>
                <span>
                  Le groupe de livres est le même (ex: Évangiles, Épîtres...)
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-4 h-4 bg-red-500 rounded-full"></span>
                <span>Aucune correspondance</span>
              </li>
            </ul>
          </div>

          <div className="space-y-1">
            <p className="text-sm sm:text-base font-medium text-gray-800 dark:text-gray-200">
              Les flèches indiquent :
            </p>
            <ul className="text-sm sm:text-base text-gray-700 dark:text-gray-300 space-y-2">
              <li className="flex items-center gap-2">
                <span>↑</span>
                <span>Le chapitre/verset recherché est plus grand</span>
              </li>
              <li className="flex items-center gap-2">
                <span>↓</span>
                <span>Le chapitre/verset recherché est plus petit</span>
              </li>
            </ul>
          </div>

          <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 mt-4">
            Utilisez ces indices pour affiner votre recherche et trouver le
            verset mystère !
          </p>
        </div>
      </div>
    </div>
  );
};

export default VersetsInstructions;
