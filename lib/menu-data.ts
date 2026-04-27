import { promises as fs } from "node:fs";
import path from "node:path";

import { getMonthKey, shiftIsoDate } from "@/lib/date-format";
import type {
  DailyMenuResult,
  LunchFieldKey,
  NormalizedDailyMenu,
  NormalizedLunchField,
  RawDailyMenu,
  RawMonthlyMenu
} from "@/types/menu";

const DATA_DIR = path.join(process.cwd(), "data", "menus");
const MONTH_FILE_PATTERN = /^(January|February|March|April|May|June|July|August|September|October|November|December)(\d{4})\.json$/;
const MONTH_INDEX: Record<string, number> = {
  January: 0,
  February: 1,
  March: 2,
  April: 3,
  May: 4,
  June: 5,
  July: 6,
  August: 7,
  September: 8,
  October: 9,
  November: 10,
  December: 11
};

const LUNCH_FIELD_LABELS: Record<LunchFieldKey, string> = {
  salad: "Salad",
  healthy: "Healthy",
  vegetable: "Vegetable",
  dal: "Dal",
  rice: "Rice",
  roti_puri_bread: "Roti / Puri / Bread",
  fruit_dessert: "Fruit / Dessert"
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
}

function toOptionalString(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value : null;
}

function normalizeLunch(rawLunch: RawDailyMenu["lunch"]): NormalizedLunchField[] {
  const lunch = isRecord(rawLunch) ? rawLunch : {};

  return (Object.keys(LUNCH_FIELD_LABELS) as LunchFieldKey[]).map((key) => ({
    key,
    label: LUNCH_FIELD_LABELS[key],
    value: toOptionalString(lunch[key])
  }));
}

function normalizeDailyMenu(raw: RawDailyMenu): NormalizedDailyMenu {
  const breakfast = isRecord(raw.breakfast) ? raw.breakfast : {};

  return {
    breakfastItems: toStringArray(breakfast.items),
    breakfastAccompaniments: toStringArray(breakfast.accompaniments),
    lunch: normalizeLunch(raw.lunch),
    eveningSnacks: toStringArray(raw.evening_snacks)
  };
}

function parseMonthFileName(fileName: string): { year: number; month: number } | null {
  const match = fileName.match(MONTH_FILE_PATTERN);

  if (!match) {
    return null;
  }

  const [, monthName, yearText] = match;
  return {
    year: Number(yearText),
    month: MONTH_INDEX[monthName]
  };
}

function getMonthBounds(fileName: string): { start: string; end: string } | null {
  const parsed = parseMonthFileName(fileName);

  if (!parsed) {
    return null;
  }

  const startDate = new Date(Date.UTC(parsed.year, parsed.month, 1));
  const endDate = new Date(Date.UTC(parsed.year, parsed.month + 1, 0));

  return {
    start: startDate.toISOString().slice(0, 10),
    end: endDate.toISOString().slice(0, 10)
  };
}

async function listMonthFiles(): Promise<string[]> {
  const entries = await fs.readdir(DATA_DIR, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isFile() && MONTH_FILE_PATTERN.test(entry.name))
    .map((entry) => entry.name)
    .sort((left, right) => {
      const leftParsed = parseMonthFileName(left);
      const rightParsed = parseMonthFileName(right);

      if (!leftParsed || !rightParsed) {
        return left.localeCompare(right);
      }

      return leftParsed.year - rightParsed.year || leftParsed.month - rightParsed.month;
    });
}

async function readMonthFile(monthKey: string): Promise<RawMonthlyMenu | null> {
  const filePath = path.join(DATA_DIR, `${monthKey}.json`);

  try {
    const fileContents = await fs.readFile(filePath, "utf8");
    const parsed = JSON.parse(fileContents) as unknown;
    return isRecord(parsed) ? (parsed as RawMonthlyMenu) : null;
  } catch {
    return null;
  }
}

export async function getDailyMenu(date: string): Promise<DailyMenuResult> {
  const monthKey = getMonthKey(date);
  const monthFiles = await listMonthFiles();
  const monthlyMenu = await readMonthFile(monthKey);
  const rawEntry = monthlyMenu?.[date];

  return {
    date,
    menu: rawEntry ? normalizeDailyMenu(rawEntry) : null,
    hasMonthFile: monthFiles.includes(`${monthKey}.json`),
    availableMonthKeys: monthFiles.map((fileName) => fileName.replace(/\.json$/, ""))
  };
}

export async function getDateStripDates(selectedDate: string): Promise<string[]> {
  const monthFiles = await listMonthFiles();

  if (monthFiles.length === 0) {
    return [selectedDate];
  }

  const firstBounds = getMonthBounds(monthFiles[0]);
  const lastBounds = getMonthBounds(monthFiles[monthFiles.length - 1]);

  if (!firstBounds || !lastBounds) {
    return [selectedDate];
  }

  let start = firstBounds.start;
  let end = lastBounds.end;

  if (selectedDate < start) {
    start = selectedDate;
  }

  if (selectedDate > end) {
    end = selectedDate;
  }

  const dates: string[] = [];
  let cursor = start;

  while (cursor <= end) {
    dates.push(cursor);
    cursor = shiftIsoDate(cursor, 1);
  }

  return dates;
}
