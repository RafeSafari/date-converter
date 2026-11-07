import { parseNumericDate } from "./parse";
import {
  dateToRataDie,
  dateToUnixDays,
  rataDieToLocalDate,
} from "./rd";

// Proleptic arithmetic Hebrew calendar (Reingold/Fourmilab rules). Months are
// numbered in the civil order that starts with Tishrei; leap years have 13
// months and Adar is split into Adar I (6) and Adar II (7).
const HEBREW_EPOCH = -1_373_427;

export const HEBREW_MIN_YEAR = 1;
export const HEBREW_MAX_YEAR = 9999;

const COMMON_MONTHS = [
  "تیشری",
  "حشوان",
  "کیسلو",
  "طوت",
  "شواط",
  "آدار",
  "نیسان",
  "ایار",
  "سیوان",
  "تموز",
  "آو",
  "الول",
];

const LEAP_MONTHS = [
  "تیشری",
  "حشوان",
  "کیسلو",
  "طوت",
  "شواط",
  "آدار الف",
  "آدار ب",
  "نیسان",
  "ایار",
  "سیوان",
  "تموز",
  "آو",
  "الول",
];

const pad = (value: number, length = 2): string => String(value).padStart(length, "0");

const isKnownYear = (year: number): boolean =>
  Number.isInteger(year) && year >= HEBREW_MIN_YEAR && year <= HEBREW_MAX_YEAR;

const isLeapYear = (year: number): boolean => ((7 * year + 1) % 19) < 7;

const monthsInYear = (year: number): number => (isLeapYear(year) ? 13 : 12);

const moladDelay = (year: number): number => {
  const months = Math.floor((235 * year - 234) / 19);
  const parts = 12_084 + 13_753 * months;
  const day = 29 * months + Math.floor(parts / 25_920);
  return ((3 * (day + 1)) % 7) < 3 ? day + 1 : day;
};

const yearDelay = (year: number): number => {
  const previous = moladDelay(year - 1);
  const present = moladDelay(year);
  const next = moladDelay(year + 1);
  if (next - present === 356) {
    return 2;
  }
  if (present - previous === 382) {
    return 1;
  }
  return 0;
};

const newYearRd = (year: number): number => HEBREW_EPOCH + moladDelay(year) + yearDelay(year);

const yearLength = (year: number): number => newYearRd(year + 1) - newYearRd(year);

const monthLength = (year: number, month: number): number => {
  if (!isKnownYear(year) || !Number.isInteger(month) || month < 1 || month > monthsInYear(year)) {
    return 0;
  }
  if (month === 1) return 30;
  if (month === 2) return yearLength(year) % 10 === 5 ? 30 : 29;
  if (month === 3) return yearLength(year) % 10 === 3 ? 29 : 30;
  if (month === 4) return 29;
  if (month === 5) return 30;
  const position = month - 6;
  return isLeapYear(year)
    ? (position % 2 === 0 ? 30 : 29)
    : (position % 2 === 1 ? 30 : 29);
};

const isValidDate = (year: number, month: number, day: number): boolean =>
  isKnownYear(year) &&
  Number.isInteger(day) &&
  day >= 1 &&
  day <= monthLength(year, month);

const toRd = (year: number, month: number, day: number): number | null => {
  if (!isValidDate(year, month, day)) {
    return null;
  }
  let rd = newYearRd(year) + day - 1;
  for (let index = 1; index < month; index += 1) {
    rd += monthLength(year, index);
  }
  return rd;
};

interface HebrewParts {
  year: number;
  month: number;
  day: number;
}

const fromRd = (rd: number): HebrewParts | null => {
  if (!Number.isFinite(rd) || rd < newYearRd(HEBREW_MIN_YEAR) || rd >= newYearRd(HEBREW_MAX_YEAR + 1)) {
    return null;
  }

  let year = Math.floor((rd - HEBREW_EPOCH) / 365.2468) + 1;
  while (newYearRd(year) > rd) {
    year -= 1;
  }
  while (newYearRd(year + 1) <= rd) {
    year += 1;
  }

  let month = 1;
  let start = newYearRd(year);
  while (month < monthsInYear(year) && rd - start >= monthLength(year, month)) {
    start += monthLength(year, month);
    month += 1;
  }
  return { year, month, day: rd - start + 1 };
};

export default class Hebrew implements iCalendar {
  date: Date;

  constructor(input?: Date | string | iCalendar | {year:number, month:number, day:number} | number[]) {
    if (typeof input === "undefined") {
      this.date = new Date();
    } else if (typeof input === "string") {
      const parts = parseNumericDate(input);
      this.date = parts ? Hebrew.partsToDate(parts[0], parts[1], parts[2]) : new Date(NaN);
    } else if (Array.isArray(input)) {
      this.date = Hebrew.partsToDate(input[0], input[1], input[2]);
    } else if (input instanceof Date) {
      this.date = input;
    } else if (typeof input?.year === "number" && typeof input?.month === "number" && typeof input?.day === "number") {
      this.date = Hebrew.partsToDate(input.year, input.month, input.day);
    } else if ('valueOf' in input && typeof input.valueOf === 'function') {
      this.date = new Date(Number(input.valueOf()));
    } else {
      throw new Error("Invalid argument type");
    }
  }

  private static partsToDate(year: number, month: number, day: number): Date {
    const rd = toRd(year, month, day);
    return rd === null ? new Date(NaN) : rataDieToLocalDate(rd);
  }

  private parts(): HebrewParts | null {
    if (isNaN(this.date.getTime())) {
      return null;
    }
    return fromRd(dateToRataDie(this.date));
  }

  static getMonths(year?: number): {name: string, value: number}[] {
    const names =
      Number.isInteger(year) && isKnownYear(year as number) && isLeapYear(year as number)
        ? LEAP_MONTHS
        : COMMON_MONTHS;
    return names.map((name, index) => ({ value: index + 1, name }));
  }

  static getDaysInMonth(month: number, year: number): number {
    return monthLength(year, month);
  }

  valueOf(): Date {
    return this.date;
  }

  format(format: string = "hYYYY/hMM/hDD"): string {
    const parts = this.parts();
    if (!parts) {
      return "-";
    }

    const monthName = Hebrew.getMonths(parts.year)[parts.month - 1]?.name ?? "";
    const replacements: { [token: string]: string } = {
      hYYYY: pad(parts.year, 4),
      hYY: pad(parts.year % 100),
      hMMMM: monthName,
      hMM: pad(parts.month),
      hM: String(parts.month),
      hDD: pad(parts.day),
      hD: String(parts.day),
    };

    return format.replace(/hYYYY|hYY|hMMMM|hMM|hM|hDD|hD/g, token => replacements[token]);
  }

  unixDays(): number {
    return isNaN(this.date.getTime()) ? NaN : dateToUnixDays(this.date);
  }

  day(): number {
    return this.parts()?.day ?? NaN;
  }

  month(): number {
    return this.parts()?.month ?? NaN;
  }

  year(): number {
    return this.parts()?.year ?? NaN;
  }

  isValid(): boolean {
    const parts = this.parts();
    return parts !== null && isValidDate(parts.year, parts.month, parts.day);
  }

  getParts(): string[] {
    const parts = this.parts();
    if (!parts) {
      return ["-", "-", "-"];
    }
    const monthName = Hebrew.getMonths(parts.year)[parts.month - 1]?.name ?? "";
    return [String(parts.year), monthName, String(parts.day)];
  }
}
