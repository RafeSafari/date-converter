import JalaliMoment from "jalali-moment";
import { parseNumericDate } from "./parse";

const DAY_MS = 86_400_000;

export default class Jalali implements iCalendar {
  date: Date;

  constructor(input?: Date | string | iCalendar | {year:number, month:number, day:number} | number[]) {
    if (typeof input === "undefined") {
      this.date = new Date();
    } else if (typeof input === "string") {
      const parts = parseNumericDate(input);
      this.date = parts ? Jalali.partsToDate(parts[0], parts[1], parts[2]) : new Date(NaN);
    } else if (Array.isArray(input)) {
      this.date = Jalali.partsToDate(input[0], input[1], input[2]);
    } else if (input instanceof Date) {
      this.date = input;
    } else if (typeof input?.year === "number" && typeof input?.month === "number" && typeof input?.day === "number") {
      this.date = Jalali.partsToDate(input.year, input.month, input.day);
    } else if ('valueOf' in input && typeof input.valueOf === 'function') {
      this.date = new Date(Number(input.valueOf()));
    } else {
      throw new Error("Invalid argument type");
    }
  }

  private static partsToDate(year: number, month: number, day: number): Date {
    try {
      const value = JalaliMoment(`${year}-${month}-${day}`, "jYYYY-jMM-jDD");
      if (
        !value.isValid() ||
        value.jYear() !== year ||
        value.jMonth() + 1 !== month ||
        value.jDate() !== day
      ) {
        return new Date(NaN);
      }
      return value.toDate();
    } catch {
      return new Date(NaN);
    }
  }

  static getMonths(_year?: number): {name: string, value: number}[] {
    return [
      { value: 1,  name: "فروردین" },
      { value: 2,  name: "اردیبهشت" },
      { value: 3,  name: "خرداد" },
      { value: 4,  name: "تیر" },
      { value: 5,  name: "مرداد" },
      { value: 6,  name: "شهریور" },
      { value: 7,  name: "مهر" },
      { value: 8,  name: "آبان" },
      { value: 9,  name: "آذر" },
      { value: 10, name: "دی" },
      { value: 11, name: "بهمن" },
      { value: 12, name: "اسفند" },
    ];
  }

  static getDaysInMonth(month: number, year: number): number {
    if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) {
      return 0;
    }
    try {
      const value = JalaliMoment(`${year}-${month}-20`, "jYYYY-jMM-jDD");
      return value.isValid() ? value.jDaysInMonth() : 0;
    } catch {
      return 0;
    }
  }

  valueOf(): Date {
    return this.date;
  }

  format(format: string = "jYYYY/jMM/jDD", locale = "fa"): string {
    try {
      return JalaliMoment(this.date).locale(locale).format(format);
    } catch {
      return '-';
    }
  }

  unixDays(): number {
    if (isNaN(this.date.getTime())) {
      return NaN;
    }
    return Math.floor(Date.UTC(this.date.getFullYear(), this.date.getMonth(), this.date.getDate()) / DAY_MS);
  }

  day(): number {
    return this.isValid() ? JalaliMoment(this.date).jDate() : NaN;
  }

  month(): number {
    return this.isValid() ? JalaliMoment(this.date).jMonth() + 1 : NaN;
  }

  year(): number {
    return this.isValid() ? JalaliMoment(this.date).jYear() : NaN;
  }

  isValid(): boolean {
    if (isNaN(this.date.getTime())) {
      return false;
    }
    try {
      const value = JalaliMoment(this.date);
      return value.isValid() && Number.isFinite(value.jYear()) && Number.isFinite(value.jMonth()) && Number.isFinite(value.jDate());
    } catch {
      return false;
    }
  }
  
  getParts(): string[] {
    return this.isValid() ? this.format("jYYYY jMMMM jD").split(" ") : ["-", "-", "-"];
  }
}
