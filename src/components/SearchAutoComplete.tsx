import React, { useState, useEffect, useRef } from "react";
import { normalizeString } from "@/lib/utils";

interface SearchAutocompleteProps {
  saints: Saint[];
  value: string;
  onChange: (value: string) => void;
  onSelect: (saintName: string) => void;
  onSubmit: (saintName: string) => void;
  isShaking: boolean;
  getTypeColor: (type: SaintType) => string;
  triggerShake: () => void;
  guessedSaints: string[];
}

const SearchAutocomplete: React.FC<SearchAutocompleteProps> = ({
  saints,
  value,
  onChange,
  onSelect,
  onSubmit,
  isShaking,
  getTypeColor,
  triggerShake,
  guessedSaints,
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSaints, setFilteredSaints] = useState<Saint[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value.trim()) {
      const normalizedSearch = normalizeString(value);
      const filtered = saints.filter((saint) => {
        const normalizedName = normalizeString(saint.name);
        return (
          !guessedSaints.includes(saint.name) &&
          normalizedName.startsWith(normalizedSearch)
        );
      });
      setFilteredSaints(filtered);
      setShowSuggestions(true);
    } else {
      setFilteredSaints([]);
      setShowSuggestions(false);
    }
  }, [value, saints, guessedSaints]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (
        filteredSaints.length > 0 &&
        !guessedSaints.includes(filteredSaints[0].name)
      ) {
        handleSuggestionClick(filteredSaints[0].name);
      } else {
        triggerShake();
      }
    }
  };

  const handleSuggestionClick = (saintName: string) => {
    if (!guessedSaints.includes(saintName)) {
      onSelect(saintName);
      setShowSuggestions(false);
      onSubmit(saintName);
    }
  };

  return (
    <div className="relative w-64">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setShowSuggestions(true)}
        placeholder="Entrez le nom d'un saint"
        className={`w-full px-4 py-2 rounded-lg border-2 
          ${
            isShaking
              ? "animate-shake border-shake-border ring-2 ring-shake-ring"
              : "border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900"
          } 
          bg-white dark:bg-gray-800 
          text-gray-900 dark:text-gray-100 
          placeholder-gray-500 dark:placeholder-gray-400
          outline-none transition-all duration-200`}
      />
      {showSuggestions && filteredSaints.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-64 overflow-y-auto"
        >
          {filteredSaints.map((saint) => (
            <div
              key={saint.name}
              onClick={() => handleSuggestionClick(saint.name)}
              className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center justify-between"
            >
              <span className="text-gray-900 dark:text-gray-100">
                {saint.name}
              </span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(
                  saint.type as SaintType
                )}`}
              >
                {saint.type}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchAutocomplete;
