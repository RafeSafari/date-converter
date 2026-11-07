import { BadiDate } from "badidate-fixed";
import { parseNumericDate } from "./parse";

const DAY_MS = 86_400_000;

export default class Badi implements iCalendar {
  date: Date;

  constructor(input?: Date | string | iCalendar | {year:number, month:number, day:number} | number[]) {
    if (typeof input === "undefined") {
      this.date = new Date();
    } else if (typeof input === "string") {
      const parts = parseNumericDate(input);
      this.date = parts ? Badi.partsToDate(parts[0], parts[1], parts[2]) : new Date(NaN);
    } else if (Array.isArray(input)) {
      this.date = Badi.partsToDate(input[0], input[1], input[2]);
    } else if (input instanceof Date) {
      this.date = input;
    } else if (typeof input?.year === "number" && typeof input?.month === "number" && typeof input?.day === "number") {
      this.date = Badi.partsToDate(input.year, input.month, input.day);
    } else if ('valueOf' in input && typeof input.valueOf === 'function') {
      this.date = new Date(Number(input.valueOf()));
    } else {
      throw new Error("Invalid argument type");
    }
  }

  private static partsToDate(year: number, month: number, day: number): Date {
    const badiDate = new BadiDate({ year, month, day });
    if (!badiDate.isValid || badiDate.year !== year || badiDate.month !== month || badiDate.day !== day) {
      return new Date(NaN);
    }
    const gregorian = badiDate.gregorianDate;
    if (!gregorian.isValid) {
      return new Date(NaN);
    }
    return new Date(gregorian.year, gregorian.month - 1, gregorian.day);
  }

  static getMonths(): {name: string, value: number}[] {
    return [
      { value: 1, name: "شهرالبهاء", },
      { value: 2, name: "شهرالجلال", },
      { value: 3, name: "شهرالجمال", },
      { value: 4, name: "شهرالعظمة", },
      { value: 5, name: "شهرالنور", },
      { value: 6, name: "شهرالرحمة", },
      { value: 7, name: "شهرالكلمات", },
      { value: 8, name: "شهرالكمال", },
      { value: 9, name: "شهرالاسماء", },
      { value: 10, name: "شهرالعزة", },
      { value: 11, name: "شهرالمشية", },
      { value: 12, name: "شهرالعلم", },
      { value: 13, name: "شهرالقدرة", },
      { value: 14, name: "شهرالقول", },
      { value: 15, name: "شهرالمسائل", },
      { value: 16, name: "شهرالشرف", },
      { value: 17, name: "شهرالسلطان", },
      { value: 18, name: "شهرالملك", },
      { value: 20, name: "ایام هاء", },
      { value: 19, name: "شهرالعلاء", },
    ];
  }

  static getDaysInMonth(month: number, year: number): number {
    if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 20) {
      return 0;
    }
    const badiDate = new BadiDate({ year, month: 20, day: 1 });
    if (!badiDate.isValid) {
      return 0;
    }
    return month === 20 ? badiDate.ayyamiHaLength : 19;
  }

  valueOf(): Date {
    return this.date;
  }

  format(format: string = "y m d", lang = "fa"): string {
    const badiDate = new BadiDate(this.date);
    return badiDate.isValid ? badiDate.format(format, lang) : "-";
  }

  unixDays(): number {
    if (isNaN(this.date.getTime())) {
      return NaN;
    }
    return Math.floor(Date.UTC(this.date.getFullYear(), this.date.getMonth(), this.date.getDate()) / DAY_MS);
  }

  day(): number {
    return new BadiDate(this.date).day;
  }

  month(): number {
    return new BadiDate(this.date).month;
  }

  year(): number {
    return new BadiDate(this.date).year;
  }

  isValid(): boolean {
    return new BadiDate(this.date).isValid;
  }
  
  getParts(): string[] {
    const badiDate = new BadiDate(this.date);
    if (!badiDate.isValid) {
      return ["-", "-", "-"];
    }
    const monthName = Badi.getMonths().find((month) => month.value === badiDate.month)?.name ?? "";
    return [String(badiDate.year), monthName, String(badiDate.day)];
  }
}
