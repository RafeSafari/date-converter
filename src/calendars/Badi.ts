import BadiDateLocal from "lib/Badi";
import { BadiDate } from "badidate";
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
      console.log('input', input)
      console.log('valueOf', moment())
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

  static getMonths(): string[] {
    return [
      "شهرالبهاء",
      "شهرالجلال",
      "شهرالجمال",
      "شهرالعظمة",
      "شهرالنور",
      "شهرالرحمة",
      "شهرالكلمات",
      "شهرالكمال",
      "شهرالاسماء",
      "شهرالعزة",
      "شهرالمشية",
      "شهرالعلم",
      "شهرالقدرة",
      "شهرالقول",
      "شهرالمسائل",
      "شهرالشرف",
      "شهرالسلطان",
      "شهرالملك",
      "ایام هاء",
      "شهرالعلاء",
    ];
  }

  static getDayInMonth(month: number, year: number): number {
    if (month == 19) {
      return new BadiDate(`${year}-${month}-2`).ayyamiHaLength;
    } else {
      return 19;
    }
  }

  valueOf(): Date {
    return this.date;
  }

  format(format: string = "y m d"): string {
    return new BadiDate(this.date).format(format, "fa");
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

  getParts(): string[] {
    return this.format("y شهرMM d").split(" ");
  }
}
