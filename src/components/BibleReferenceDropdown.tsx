import React, { useState, useMemo } from "react";
import { Book, ChevronDown } from "lucide-react";

interface BibleReferenceDropdownProps {
  onSubmit: (reference: string) => void;
  verseData: Book[];
  isShaking?: boolean;
  usedVerses?: string[];
}

const BibleReferenceDropdown: React.FC<BibleReferenceDropdownProps> = ({
  onSubmit,
  verseData,
  isShaking = false,
  usedVerses = [],
}) => {
  const [selectedBook, setSelectedBook] = useState<string>("");
  const [selectedChapter, setSelectedChapter] = useState<string>("");
  const [selectedVerse, setSelectedVerse] = useState<string>("");
  const [showBookDropdown, setShowBookDropdown] = useState<boolean>(false);
  const [showChapterDropdown, setShowChapterDropdown] =
    useState<boolean>(false);
  const [showVerseDropdown, setShowVerseDropdown] = useState<boolean>(false);

  // Memorized calculations for used combinations
  const usedCombinations = useMemo(() => {
    const combinations = {
      books: new Set<string>(),
      chapters: new Set<string>(),
      verses: new Set<string>(),
    };

    usedVerses.forEach((reference) => {
      const [bookName, chapterVerse] = reference.split(" ");
      const [chapter] = chapterVerse.split(":");

      combinations.books.add(bookName);
      combinations.chapters.add(`${bookName} ${chapter}`);
      combinations.verses.add(reference);
    });

    return combinations;
  }, [usedVerses]);

  const selectedBookName = useMemo(() => {
    return verseData.find((e) => e.abbrev === selectedBook)?.name;
  }, [selectedBook, verseData]);

  // Group books by testament
  const groupedBooks = useMemo(() => {
    const groups = {
      "Ancien Testament": verseData.filter(
        (book) => book.canon === "Ancien Testament"
      ),
      "Nouveau Testament": verseData.filter(
        (book) => book.canon === "Nouveau Testament"
      ),
    };
    return groups;
  }, [verseData]);

  // Utility functions
  const hasUnusedVerses = (abbrev: string): boolean => {
    const book = verseData.find((b) => b.abbrev === abbrev);
    if (!book) return false;

    for (
      let chapterIndex = 0;
      chapterIndex < book.chapters.length;
      chapterIndex++
    ) {
      const chapter = book.chapters[chapterIndex];
      for (let verseIndex = 0; verseIndex < chapter.length; verseIndex++) {
        const reference = `${abbrev} ${chapterIndex + 1}:${verseIndex + 1}`;
        if (!usedCombinations.verses.has(reference)) {
          return true;
        }
      }
    }
    return false;
  };

  const hasUnusedChapterVerses = (
    bookName: string,
    chapter: number
  ): boolean => {
    const book = verseData.find((b) => b.abbrev === bookName);
    if (!book) return false;

    const verses = book.chapters[chapter - 1];
    if (!verses) return false;

    for (let verseIndex = 0; verseIndex < verses.length; verseIndex++) {
      const reference = `${bookName} ${chapter}:${verseIndex + 1}`;
      if (!usedCombinations.verses.has(reference)) {
        return true;
      }
    }
    return false;
  };

  const getChapters = (): number[] => {
    const book = verseData.find((b) => b.abbrev === selectedBook);
    return book
      ? Array.from({ length: book.chapters.length }, (_, i) => i + 1)
      : [];
  };

  const getVerses = (): number[] => {
    const book = verseData.find((b) => b.abbrev === selectedBook);
    if (!book || !selectedChapter) return [];
    return Array.from(
      { length: book.chapters[parseInt(selectedChapter) - 1].length },
      (_, i) => i + 1
    );
  };

  const handleSubmit = (): void => {
    if (selectedBook && selectedChapter && selectedVerse) {
      const reference = `${selectedBook} ${selectedChapter}:${selectedVerse}`;
      if (!usedCombinations.verses.has(reference)) {
        onSubmit(reference);
        setSelectedBook("");
        setSelectedChapter("");
        setSelectedVerse("");
      }
    }
  };

  const closeAllDropdowns = () => {
    setShowBookDropdown(false);
    setShowChapterDropdown(false);
    setShowVerseDropdown(false);
  };

  const isSelectionComplete = selectedBook && selectedChapter && selectedVerse;
  const selectedReference = isSelectionComplete
    ? `${selectedBook} ${selectedChapter}:${selectedVerse}`
    : null;
  const isReferenceUsed = selectedReference
    ? usedCombinations.verses.has(selectedReference)
    : false;

  return (
    <div className="space-y-4">
      <div className="relative w-full max-w-3xl mx-auto flex gap-4">
        {/* Book Dropdown */}
        <div className="relative flex-1">
          <button
            type="button"
            className={`w-full px-4 py-3 text-left flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm ${
              isShaking ? "animate-shake" : ""
            }`}
            onClick={() => {
              closeAllDropdowns();
              setShowBookDropdown(!showBookDropdown);
            }}
          >
            <span className="flex items-center gap-2">
              <Book size={20} className="text-gray-400 dark:text-gray-500" />
              <span className="text-gray-700 dark:text-gray-200">
                {selectedBookName || "Sélectionner un livre"}
              </span>
            </span>
            <ChevronDown
              size={20}
              className="text-gray-400 dark:text-gray-500"
            />
          </button>

          {showBookDropdown && (
            <div className="absolute z-20 w-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-h-60 overflow-y-auto">
              {Object.entries(groupedBooks).map(([testament, books]) => (
                <div key={testament}>
                  <div className="px-4 py-2 bg-gray-100 dark:bg-gray-900 font-semibold text-gray-700 dark:text-gray-200 sticky top-0">
                    {testament}
                  </div>
                  {books.map((book) => {
                    const hasUnused = hasUnusedVerses(book.abbrev);
                    return (
                      <div
                        key={book.abbrev}
                        className={`px-4 py-2 ${
                          hasUnused
                            ? "hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-gray-700 dark:text-gray-200"
                            : "bg-gray-50 dark:bg-gray-900 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                        }`}
                        onClick={() => {
                          if (hasUnused) {
                            setSelectedBook(book.abbrev);
                            setSelectedChapter("");
                            setSelectedVerse("");
                            closeAllDropdowns();
                          }
                        }}
                      >
                        {book.name}
                        {!hasUnused && (
                          <span className="text-xs ml-2">(Tous utilisés)</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Chapter Dropdown */}
        <div className="relative flex-1">
          <button
            type="button"
            className={`w-full px-4 py-3 text-left flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm ${
              isShaking ? "animate-shake" : ""
            } ${!selectedBook ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={() => {
              if (selectedBook) {
                closeAllDropdowns();
                setShowChapterDropdown(!showChapterDropdown);
              }
            }}
            disabled={!selectedBook}
          >
            <span className="text-gray-700 dark:text-gray-200">
              {selectedChapter
                ? `Chapitre ${selectedChapter}`
                : "Sélectionner chapitre"}
            </span>
            <ChevronDown
              size={20}
              className="text-gray-400 dark:text-gray-500"
            />
          </button>

          {showChapterDropdown && (
            <div className="absolute z-20 w-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-h-60 overflow-y-auto">
              <div className="grid grid-cols-6 gap-1 p-2">
                {getChapters().map((chapter) => {
                  const hasUnused = hasUnusedChapterVerses(
                    selectedBook,
                    chapter
                  );
                  return (
                    <div
                      key={chapter}
                      className={`px-2 py-1 text-center rounded ${
                        hasUnused
                          ? "hover:bg-blue-100 dark:hover:bg-blue-900 cursor-pointer text-gray-700 dark:text-gray-200"
                          : "bg-gray-50 dark:bg-gray-900 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                      }`}
                      onClick={() => {
                        if (hasUnused) {
                          setSelectedChapter(chapter.toString());
                          setSelectedVerse("");
                          closeAllDropdowns();
                        }
                      }}
                    >
                      {chapter}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Verse Dropdown */}
        <div className="relative flex-1">
          <button
            type="button"
            className={`w-full px-4 py-3 text-left flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm ${
              isShaking ? "animate-shake" : ""
            } ${!selectedChapter ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={() => {
              if (selectedChapter) {
                closeAllDropdowns();
                setShowVerseDropdown(!showVerseDropdown);
              }
            }}
            disabled={!selectedChapter}
          >
            <span className="text-gray-700 dark:text-gray-200">
              {selectedVerse
                ? `Verset ${selectedVerse}`
                : "Sélectionner verset"}
            </span>
            <ChevronDown
              size={20}
              className="text-gray-400 dark:text-gray-500"
            />
          </button>

          {showVerseDropdown && (
            <div className="absolute z-20 w-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-h-60 overflow-y-auto">
              <div className="grid grid-cols-6 gap-1 p-2">
                {getVerses().map((verse) => {
                  const reference = `${selectedBook} ${selectedChapter}:${verse}`;
                  const isUsed = usedCombinations.verses.has(reference);
                  return (
                    <div
                      key={verse}
                      className={`px-2 py-1 text-center rounded ${
                        isUsed
                          ? "bg-gray-50 dark:bg-gray-900 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                          : "hover:bg-blue-100 dark:hover:bg-blue-900 cursor-pointer text-gray-700 dark:text-gray-200"
                      }`}
                      onClick={() => {
                        if (!isUsed) {
                          setSelectedVerse(verse.toString());
                          closeAllDropdowns();
                        }
                      }}
                    >
                      {verse}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-center">
        <button
          onClick={handleSubmit}
          disabled={!isSelectionComplete || isReferenceUsed}
          className={`px-6 py-2 rounded-lg shadow transition-all duration-200 ${
            isSelectionComplete && !isReferenceUsed
              ? "bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800 text-white"
              : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed"
          }`}
        >
          {isReferenceUsed
            ? "Verset déjà utilisé"
            : isSelectionComplete
            ? `Valider ${selectedBook} ${selectedChapter}:${selectedVerse}`
            : "Sélectionnez un verset"}
        </button>
      </div>
    </div>
  );
};

export default BibleReferenceDropdown;
