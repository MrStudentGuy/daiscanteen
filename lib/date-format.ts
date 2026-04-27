const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const UTC_SUFFIX = "T00:00:00Z";

function parseDateParts(date: string): { year: number; month: number; day: number } | null {
  if (!DATE_PATTERN.test(date)) {
    return null;
  }

  const [yearText, monthText, dayText] = date.split("-");
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const parsed = new Date(`${date}${UTC_SUFFIX}`);

  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  if (
    parsed.getUTCFullYear() !== year ||
    parsed.getUTCMonth() + 1 !== month ||
    parsed.getUTCDate() !== day
  ) {
    return null;
  }

  return { year, month, day };
}

export function isValidIsoDate(date: string): boolean {
  return parseDateParts(date) !== null;
}

export function getTodayIsoDate(timeZone = "Asia/Kolkata"): string {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });

  return formatter.format(new Date());
}

export function normalizeRequestedDate(date: string | undefined, fallback = getTodayIsoDate()): string {
  if (!date) {
    return fallback;
  }

  return isValidIsoDate(date) ? date : fallback;
}

export function shiftIsoDate(date: string, offsetDays: number): string {
  const parsed = new Date(`${date}${UTC_SUFFIX}`);
  parsed.setUTCDate(parsed.getUTCDate() + offsetDays);
  return parsed.toISOString().slice(0, 10);
}

export function getMonthKey(date: string): string {
  const parts = parseDateParts(date);
  if (!parts) {
    throw new Error(`Invalid date: ${date}`);
  }

  const monthName = new Intl.DateTimeFormat("en-US", {
    month: "long",
    timeZone: "UTC"
  }).format(new Date(Date.UTC(parts.year, parts.month - 1, 1)));

  return `${monthName}${parts.year}`;
}

export function formatCalendarDateParts(date: string): { weekday: string; day: string; month: string } {
  const parsed = new Date(`${date}${UTC_SUFFIX}`);

  return {
    weekday: new Intl.DateTimeFormat("en-US", { weekday: "short", timeZone: "UTC" }).format(parsed),
    day: new Intl.DateTimeFormat("en-US", { day: "2-digit", timeZone: "UTC" }).format(parsed),
    month: new Intl.DateTimeFormat("en-US", { month: "short", timeZone: "UTC" }).format(parsed)
  };
}
