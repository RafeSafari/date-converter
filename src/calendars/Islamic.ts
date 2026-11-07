import { parseNumericDate } from "./parse";
import {
  HijriDate,
  dateToRjd,
  dateToUnixDays,
  hijriMonthLength,
  hijriToRjd,
  isValidHijriDate,
  rjdToHijri,
  rjdToLocalDate,
} from "./ummalqura";

const MONTH_NAMES = [
  "المحرّم",
  "صفر",
  "ربیع الاول",
  "ربیع الثّانی",
  "جمادی الاول",
  "جمادی الثّانی",
  "رجب",
  "شعبان",
  "رمضان",
  "شوّال",
  "ذو القعدة",
  "ذو الحجّة",
];

export default class Islamic implements iCalendar {
  date: Date;

  constructor(input?: Date | string | iCalendar | {year:number, month:number, day:number} | number[]) {
    if (typeof input === "undefined") {
      this.date = new Date();
    } else if (typeof input === "string") {
      const parts = parseNumericDate(input);
      this.date = parts ? Islamic.partsToDate(parts[0], parts[1], parts[2]) : new Date(NaN);
    } else if (Array.isArray(input)) {
      this.date = Islamic.partsToDate(input[0], input[1], input[2]);
    } else if (input instanceof Date) {
      this.date = input;
    } else if (typeof input?.year === "number" && typeof input?.month === "number" && typeof input?.day === "number") {
      this.date = Islamic.partsToDate(input.year, input.month, input.day);
    } else if ('valueOf' in input && typeof input.valueOf === 'function') {
      this.date = new Date(Number(input.valueOf()));
    } else {
      throw new Error("Invalid argument type");
    }
  }

  private static partsToDate(year: number, month: number, day: number): Date {
    const rjd = hijriToRjd({ year, month, day });
    return rjd === null ? new Date(NaN) : rjdToLocalDate(rjd);
  }

  private parts(): HijriDate | null {
    if (isNaN(this.date.getTime())) {
      return null;
    }
    return rjdToHijri(dateToRjd(this.date));
  }

  static getMonths(_year?: number): {name: string, value: number}[] {
    return MONTH_NAMES.map((name, index) => ({ value: index + 1, name }));
  }

  static getDaysInMonth(month: number, year: number): number {
    return hijriMonthLength(year, month);
  }

  valueOf(): Date {
    return this.date;
  }

  format(format: string = "iYYYY/iMM/iDD"): string {
    const parts = this.parts();
    if (!parts) {
      return "-";
    }

    const pad = (value: number, length: number): string => String(value).padStart(length, "0");
    const yearStart = hijriToRjd({ year: parts.year, month: 1, day: 1 });
    const dayOfYear = yearStart === null ? NaN : dateToRjd(this.date) - yearStart + 1;
    const replacements: { [token: string]: string } = {
      iYYYYY: pad(parts.year, 5),
      iYYYY: pad(parts.year, 4),
      iYY: pad(parts.year % 100, 2),
      iMMMM: MONTH_NAMES[parts.month - 1],
      iMMM: MONTH_NAMES[parts.month - 1],
      iMM: pad(parts.month, 2),
      iM: String(parts.month),
      iDDD: pad(dayOfYear, 3),
      iDD: pad(parts.day, 2),
      iD: String(parts.day),
    };

    return format.replace(/iYYYYY|iYYYY|iYY|iMMMM|iMMM|iMM|iM|iDDD|iDD|iD/g, (token) => replacements[token]);
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
    return parts !== null && isValidHijriDate(parts);
  }

  getParts(): string[] {
    const parts = this.parts();
    if (!parts) {
      return ["-", "-", "-"];
    }
    return [String(parts.year), MONTH_NAMES[parts.month - 1], String(parts.day)];
  }
}
