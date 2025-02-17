import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const normalizeString = (str: string) => {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Supprime les accents
    .replace(/[^a-z0-9]/g, ""); // Garde uniquement les lettres et chiffres
};

export const feastDayToDate = (feastDay: string): Date => {
  const [day, month] = feastDay.split(" ");
  const monthMap: { [key: string]: number } = {
    janvier: 0,
    février: 1,
    mars: 2,
    avril: 3,
    mai: 4,
    juin: 5,
    juillet: 6,
    août: 7,
    septembre: 8,
    octobre: 9,
    novembre: 10,
    décembre: 11,
  };
  return new Date(2024, monthMap[month.toLowerCase()], parseInt(day));
};

export const hasCommonElement = (list1: string, list2: string): boolean => {
  const items1 = list1
    .toLowerCase()
    .split(",")
    .map((item) => item.trim());
  const items2 = list2
    .toLowerCase()
    .split(",")
    .map((item) => item.trim());
  return items1.some((item1) =>
    items2.some((item2) => item2.includes(item1) || item1.includes(item2))
  );
};

export const periodToNumber = (period: string): number => {
  // Gestion des périodes avant J.-C.
  if (period.includes("av. J.-C.")) {
    const century = period
      .replace("e siècle av. J.-C.", "")
      .replace("er siècle av. J.-C.", "");
    if (century.includes("-")) {
      // Cas spécial pour "7e-6e siècle av. J.-C."
      const [start] = century.split("-");
      return -parseInt(start) * 100;
    }
    // Cas spécial pour "2000 av. J.-C."
    if (century === "2000") {
      return -2000;
    }
    return -parseInt(century) * 100;
  }

  // Gestion des périodes après J.-C.
  const century = period.replace("e siècle", "").replace("er siècle", "");
  return parseInt(century) * 100;
};

export const comparePeriods = (period1: string, period2: string): number => {
  const num1 = periodToNumber(period1);
  const num2 = periodToNumber(period2);
  return num1 - num2;
};

export const getCurrentDate = (): string => {
  const date = new Date();
  return date.toISOString().split("T")[0];
};

export const compareDates = (dateA: string, dateB: string): number => {
  const a = new Date(dateA);
  const b = new Date(dateB);

  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
};
