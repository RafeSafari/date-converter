import { parseNumericDate } from "./parse";
import {
  dateToRataDie,
  dateToUnixDays,
  gregorianToRataDie,
  rataDieToLocalDate,
} from "./rd";

export const CHINESE_MIN_YEAR = 1900;
export const CHINESE_MAX_YEAR = 2100;

// Number of days per lunar year 1900-2100, bit-packed:
// bits 0-3 hold the leap month (0 = none), bits 4-15 the 12 regular month
// lengths (1 = 30 days), bit 16 the leap month length (1 = 30 days).
// Regenerated from lunar-javascript 1.7.8 and cross-checked against the
// Taipei Central Weather Bureau leap-month table; it corrects the widely
// copied 1933 entry (leap 5 is 30 days) and the 2097 month lengths.
const LUNAR_INFO: readonly number[] = [
  19416, 19168, 42352, 21717, 53856, 55632, 91476, 22176, 39632, 21970, 19168, 42422,
  42192, 53840, 119381, 46400, 54944, 44450, 38320, 84343, 18800, 42160, 46261, 27216,
  27968, 109396, 11104, 38256, 21234, 18800, 25958, 54432, 59984, 92821, 23248, 11104,
  100067, 37600, 116951, 51536, 54432, 120998, 46416, 22176, 107956, 9680, 37584, 53938,
  43344, 46423, 27808, 46416, 86869, 19872, 42416, 83315, 21168, 43432, 59728, 27296,
  44710, 43856, 19296, 43748, 42352, 21088, 62051, 55632, 23383, 22176, 38608, 19925,
  19152, 42192, 54484, 53840, 54616, 46400, 46752, 103846, 38320, 18864, 43380, 42160,
  45690, 27216, 27968, 44870, 43872, 38256, 19189, 18800, 25776, 29859, 59984, 27480,
  23232, 43872, 38613, 37600, 51552, 55636, 54432, 55888, 30034, 22176, 43959, 9680,
  37584, 51893, 43344, 46240, 47780, 44368, 21977, 19360, 42416, 86390, 21168, 43312,
  31060, 27296, 44368, 23378, 19296, 42726, 42208, 53856, 60005, 54576, 23200, 30371,
  38608, 19195, 19152, 42192, 118966, 53840, 54560, 56645, 46496, 22224, 21938, 18864,
  42359, 42160, 43600, 111189, 27936, 44448, 84835, 37744, 18936, 18800, 25776, 92326,
  59984, 27424, 108228, 43744, 37600, 53987, 51552, 54615, 54432, 55888, 23893, 22176,
  42704, 21972, 21200, 43448, 43344, 46240, 46758, 44368, 21920, 43940, 42416, 21168,
  45683, 26928, 29495, 27296, 44368, 84821, 19296, 42352, 21732, 53600, 59752, 54560,
  55968, 92838, 22224, 19168, 43476, 41680, 53584, 62034, 54560,
];

// A leap month repeats the previous month, so it is exposed to the UI as
// month + 12 (e.g. leap month 6 is 18) and keeps every month value unique.
const LEAP_OFFSET = 12;
const BASE_RD = gregorianToRataDie(1900, 1, 31);

const pad = (value: number, length = 2): string => String(value).padStart(length, "0");

const infoFor = (year: number): number =>
  year >= CHINESE_MIN_YEAR && year <= CHINESE_MAX_YEAR ? LUNAR_INFO[year - CHINESE_MIN_YEAR] : 0;

const leapMonth = (year: number): number => infoFor(year) & 0xf;
const leapDays = (year: number): number =>
  leapMonth(year) ? (infoFor(year) & 0x10000 ? 30 : 29) : 0;
const monthDays = (year: number, month: number): number =>
  infoFor(year) & (0x10000 >> month) ? 30 : 29;

const yearDays = (year: number): number => {
  let total = leapDays(year);
  for (let month = 1; month <= 12; month += 1) {
    total += monthDays(year, month);
  }
  return total;
};

// YEAR_STARTS[year - 1900] is the Rata Die of that lunar year's first day;
// the extra entry at index 201 is the exclusive end of 2100.
const YEAR_STARTS: readonly number[] = (() => {
  const starts: number[] = [];
  let rd = BASE_RD;
  for (let year = CHINESE_MIN_YEAR; year <= CHINESE_MAX_YEAR + 1; year += 1) {
    starts.push(rd);
    rd += yearDays(year);
  }
  return starts;
})();

const isKnownYear = (year: number): boolean =>
  Number.isInteger(year) && year >= CHINESE_MIN_YEAR && year <= CHINESE_MAX_YEAR;

const isValidDate = (year: number, month: number, day: number): boolean => {
  if (!isKnownYear(year) || !Number.isInteger(month) || !Number.isInteger(day)) {
    return false;
  }
  const leap = month > LEAP_OFFSET;
  const base = leap ? month - LEAP_OFFSET : month;
  if (base < 1 || base > 12 || (leap && leapMonth(year) !== base)) {
    return false;
  }
  return day >= 1 && day <= Chinese.getDaysInMonth(month, year);
};

const toRd = (year: number, month: number, day: number): number | null => {
  if (!isValidDate(year, month, day)) {
    return null;
  }
  const leap = month > LEAP_OFFSET;
  const base = leap ? month - LEAP_OFFSET : month;
  let rd = YEAR_STARTS[year - CHINESE_MIN_YEAR] + day - 1;
  // The leap month starts right after its regular namesake, so only the
  // regular months up to and including `base` are added. Regular months that
  // follow the leap month also include its days.
  const lastRegular = leap ? base : base - 1;
  for (let index = 1; index <= lastRegular; index += 1) {
    rd += monthDays(year, index);
  }
  if (!leap && leapMonth(year) > 0 && base > leapMonth(year)) {
    rd += leapDays(year);
  }
  return rd;
};

interface ChineseParts {
  year: number;
  month: number;
  day: number;
}

const fromRd = (rd: number): ChineseParts | null => {
  if (!Number.isFinite(rd) || rd < BASE_RD || rd >= YEAR_STARTS[CHINESE_MAX_YEAR - CHINESE_MIN_YEAR + 1]) {
    return null;
  }

  let year = CHINESE_MIN_YEAR;
  while (year < CHINESE_MAX_YEAR && rd >= YEAR_STARTS[year - CHINESE_MIN_YEAR + 1]) {
    year += 1;
  }

  let offset = rd - YEAR_STARTS[year - CHINESE_MIN_YEAR];
  const leap = leapMonth(year);
  for (let month = 1; month <= 12; month += 1) {
    const days = monthDays(year, month);
    if (offset < days) {
      return { year, month, day: offset + 1 };
    }
    offset -= days;
    if (month === leap) {
      const leapLength = leapDays(year);
      if (offset < leapLength) {
        return { year, month: leap + LEAP_OFFSET, day: offset + 1 };
      }
      offset -= leapLength;
    }
  }
  return null;
};

export default class Chinese implements iCalendar {
  date: Date;

  constructor(input?: Date | string | iCalendar | {year:number, month:number, day:number} | number[]) {
    if (typeof input === "undefined") {
      this.date = new Date();
    } else if (typeof input === "string") {
      const parts = parseNumericDate(input);
      this.date = parts ? Chinese.partsToDate(parts[0], parts[1], parts[2]) : new Date(NaN);
    } else if (Array.isArray(input)) {
      this.date = Chinese.partsToDate(input[0], input[1], input[2]);
    } else if (input instanceof Date) {
      this.date = input;
    } else if (typeof input?.year === "number" && typeof input?.month === "number" && typeof input?.day === "number") {
      this.date = Chinese.partsToDate(input.year, input.month, input.day);
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

  private parts(): ChineseParts | null {
    if (isNaN(this.date.getTime())) {
      return null;
    }
    return fromRd(dateToRataDie(this.date));
  }

  static getMonths(year?: number): {name: string, value: number}[] {
    const months: {name: string, value: number}[] = [];
    const leap = Number.isInteger(year) ? leapMonth(year as number) : 0;
    for (let month = 1; month <= 12; month += 1) {
      months.push({ value: month, name: `ماه ${month}` });
      if (month === leap) {
        months.push({ value: month + LEAP_OFFSET, name: `ماه ${month} کبیسه` });
      }
    }
    return months;
  }

  static getDaysInMonth(month: number, year: number): number {
    if (!isKnownYear(year) || !Number.isInteger(month)) {
      return 0;
    }
    if (month > LEAP_OFFSET) {
      const base = month - LEAP_OFFSET;
      return leapMonth(year) === base ? leapDays(year) : 0;
    }
    if (month < 1 || month > 12) {
      return 0;
    }
    return monthDays(year, month);
  }

  valueOf(): Date {
    return this.date;
  }

  format(format: string = "cYYYY/cMM/cDD"): string {
    const parts = this.parts();
    if (!parts) {
      return "-";
    }

    const monthName =
      Chinese.getMonths(parts.year).find(month => month.value === parts.month)?.name ?? "";
    const replacements: { [token: string]: string } = {
      cYYYY: pad(parts.year, 4),
      cYY: pad(parts.year % 100),
      cMMMM: monthName,
      cMM: pad(parts.month),
      cM: String(parts.month),
      cDD: pad(parts.day),
      cD: String(parts.day),
    };

    return format.replace(/cYYYY|cYY|cMMMM|cMM|cM|cDD|cD/g, token => replacements[token]);
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
    const monthName =
      Chinese.getMonths(parts.year).find(month => month.value === parts.month)?.name ?? "";
    return [String(parts.year), monthName, String(parts.day)];
  }
}
