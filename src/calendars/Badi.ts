import { BadiDate } from "badidate-fixed";
import moment from "moment";

export default class Badi implements iCalendar {
  date: Date;

  constructor(input?: Date | string | iCalendar | {year:number, month:number, day:number} | number[]) {
    if (typeof input === "undefined") {
      this.date = new Date();
    } else if (typeof input === "string") {
      this.date = Badi.badiDayNumberToStandardDate(new BadiDate(input).valueOf());
    } else if (Array.isArray(input)) {
      this.date = Badi.badiDayNumberToStandardDate(new BadiDate({ year: input[0], month: input[1], day: input[2] }).valueOf());
    } else if (input instanceof Date) {
      this.date = input;
    } else if (typeof input?.year === "number" && typeof input?.month === "number" && typeof input?.day === "number") {
      this.date = Badi.badiDayNumberToStandardDate(new BadiDate({ year: input?.year, month: input?.month, day: input?.day }).valueOf());
    } else if ('valueOf' in input && typeof input.valueOf === 'function') {
      this.date = new Date(Number(input.valueOf()));
    } else {
      throw new Error("Invalid argument type");
    }
  }

  static badiDayNumberToStandardDate(badiDayNumber: number): Date {
    return moment((badiDayNumber - 45943) * 86_400_000).toDate();
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
    if (month < 20) {
      return 19;
    } else {
      return new BadiDate({year, month: 20, day: 2}).ayyamiHaLength;
    }
  }

  valueOf(): Date {
    return this.date;
  }

  format(format: string = "y m d", lang = "fa"): string {
    return new BadiDate(this.date).format(format, lang);
  }

  unixDays(): number {
    return Math.floor(moment(this.date).unix() / 86_400);
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
    return !isNaN(Number(this.format("y", "en"))) && !isNaN(Number(this.format("m", "en"))) && !isNaN(Number(this.format("d", "en")));
  }
  
  getParts(): string[] {
    return this.format("y شهرMM d").split(" ");
  }
}
