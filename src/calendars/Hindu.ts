import { parseNumericDate } from "./parse";
import {
  dateToRataDie,
  dateToUnixDays,
  gregorianToRataDie,
  rataDieToGregorian,
  rataDieToLocalDate,
} from "./rd";

// Indian national (Saka) solar calendar. Year 0 begins on 22 March 79 CE;
// Chaitra has 30 days, or 31 when the following Gregorian year is a leap year,
// months 2-6 have 31 days and months 7-12 have 30 days.
export const HINDU_MIN_YEAR = 1;
export const HINDU_MAX_YEAR = 9999;

const MONTH_NAMES = [
  "چایترا",
  "وایشاکا",
  "جایستا",
  "آشارا",
  "سراوانا",
  "بهادرا",
  "آسوینا",
  "کارتیکا",
  "آگراهایانا",
  "پاوشا",
  "ماگا",
  "پالگونا",
];

const pad = (value: number, length = 2): string => String(value).padStart(length, "0");

const gregorianLeapYear = (year: number): boolean =>
  (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

const isKnownYear = (year: number): boolean =>
  Number.isInteger(year) && year >= HINDU_MIN_YEAR && year <= HINDU_MAX_YEAR;

const chaitraStart = (year: number): number => {
  const gregorianYear = year + 78;
  return gregorianToRataDie(
    gregorianYear,
    3,
    gregorianLeapYear(gregorianYear) ? 21 : 22,
  );
};

const monthLength = (year: number, month: number): number => {
  if (!isKnownYear(year) || !Number.isInteger(month) || month < 1 || month > 12) {
    return 0;
  }
  if (month === 1) {
    return gregorianLeapYear(year + 78) ? 31 : 30;
  }
  return month <= 6 ? 31 : 30;
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
  let rd = chaitraStart(year) + day - 1;
  for (let index = 1; index < month; index += 1) {
    rd += monthLength(year, index);
  }
  return rd;
};

interface HinduParts {
  year: number;
  month: number;
  day: number;
}

const fromRd = (rd: number): HinduParts | null => {
  const gregorian = rataDieToGregorian(rd);
  if (!gregorian) {
    return null;
  }

  const yearStart = chaitraStart(gregorian.year - 78);
  const year = rd >= yearStart ? gregorian.year - 78 : gregorian.year - 79;
  if (year < HINDU_MIN_YEAR || year > HINDU_MAX_YEAR) {
    return null;
  }

  let offset = rd - chaitraStart(year);
  let month = 1;
  while (month < 12 && offset >= monthLength(year, month)) {
    offset -= monthLength(year, month);
    month += 1;
  }
  return { year, month, day: offset + 1 };
};

export default class Hindu implements iCalendar {
  date: Date;

  constructor(input?: Date | string | iCalendar | {year:number, month:number, day:number} | number[]) {
    if (typeof input === "undefined") {
      this.date = new Date();
    } else if (typeof input === "string") {
      const parts = parseNumericDate(input);
      this.date = parts ? Hindu.partsToDate(parts[0], parts[1], parts[2]) : new Date(NaN);
    } else if (Array.isArray(input)) {
      this.date = Hindu.partsToDate(input[0], input[1], input[2]);
    } else if (input instanceof Date) {
      this.date = input;
    } else if (typeof input?.year === "number" && typeof input?.month === "number" && typeof input?.day === "number") {
      this.date = Hindu.partsToDate(input.year, input.month, input.day);
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

  private parts(): HinduParts | null {
    if (isNaN(this.date.getTime())) {
      return null;
    }
    return fromRd(dateToRataDie(this.date));
  }

  static getMonths(_year?: number): {name: string, value: number}[] {
    return MONTH_NAMES.map((name, index) => ({ value: index + 1, name }));
  }

  static getDaysInMonth(month: number, year: number): number {
    return monthLength(year, month);
  }

  valueOf(): Date {
    return this.date;
  }

  format(format: string = "sYYYY/sMM/sDD"): string {
    const parts = this.parts();
    if (!parts) {
      return "-";
    }

    const monthName = MONTH_NAMES[parts.month - 1];
    const replacements: { [token: string]: string } = {
      sYYYY: pad(parts.year, 4),
      sYY: pad(parts.year % 100),
      sMMMM: monthName,
      sMM: pad(parts.month),
      sM: String(parts.month),
      sDD: pad(parts.day),
      sD: String(parts.day),
    };

    return format.replace(/sYYYY|sYY|sMMMM|sMM|sM|sDD|sD/g, token => replacements[token]);
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
    return [String(parts.year), MONTH_NAMES[parts.month - 1], String(parts.day)];
  }
}
