import React, { useState } from "react";
import { X } from "lucide-react";

const SaintsInstructions = () => {
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
            Devinez le saint du jour en utilisant les indices fournis après
            chaque proposition. Chaque essai vous donnera des informations sur
            les différentes caractéristiques du saint.
          </p>

          <div className="space-y-1">
            <p className="text-sm sm:text-base font-medium text-gray-800 dark:text-gray-200">
              Les couleurs indiquent :
            </p>
            <ul className="text-sm sm:text-base text-gray-700 dark:text-gray-300 space-y-2">
              <li className="flex items-center gap-2">
                <span className="w-4 h-4 bg-emerald-500 rounded-full"></span>
                <span>La caractéristique est exactement la même</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-4 h-4 bg-yellow-500 rounded-full"></span>
                <span>Il y a une correspondance partielle</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-4 h-4 bg-orange-500 rounded-full"></span>
                <span>
                  Certains éléments sont communs (pour les attributs et
                  patronages)
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
                <span>La période ou la date de fête est plus tardive</span>
              </li>
              <li className="flex items-center gap-2">
                <span>↓</span>
                <span>La période ou la date de fête est plus précoce</span>
              </li>
            </ul>
          </div>

          <div className="space-y-1 mt-4">
            <p className="text-sm sm:text-base font-medium text-gray-800 dark:text-gray-200">
              Les types de saints :
            </p>
            <ul className="text-sm sm:text-base text-gray-700 dark:text-gray-300 grid grid-cols-1 sm:grid-cols-2 gap-2">
              <li className="flex items-center gap-2">
                <span className="px-2 py-1 bg-violet-200 dark:bg-violet-800 text-violet-800 dark:text-violet-200 rounded-full text-xs">
                  Biblique
                </span>
                <span>Personnages de la Bible</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="px-2 py-1 bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200 rounded-full text-xs">
                  Ancien
                </span>
                <span>Premiers siècles de l&apos;Église</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="px-2 py-1 bg-emerald-200 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-200 rounded-full text-xs">
                  Médiéval
                </span>
                <span>Moyen Âge</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="px-2 py-1 bg-orange-200 dark:bg-orange-800 text-orange-800 dark:text-orange-200 rounded-full text-xs">
                  Moderne
                </span>
                <span>Renaissance à 1900</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="px-2 py-1 bg-rose-200 dark:bg-rose-800 text-rose-800 dark:text-rose-200 rounded-full text-xs">
                  Contemporain
                </span>
                <span>Après 1900</span>
              </li>
            </ul>
          </div>

          <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 mt-4">
            Utilisez la barre de recherche pour proposer un saint et analysez
            les indices pour trouver le saint mystère !
          </p>
        </div>
      </div>
    </div>
  );
};

export default SaintsInstructions;
