import iCalendar from "./iCalendar";
import JalaliMoment from "jalali-moment";

export default class Jalali implements iCalendar {
  date: Date;

  constructor(date?: Date | string | iCalendar) {
    if (typeof date === "undefined") {
      this.date = new Date();
    } else if (typeof date === "string") {
      this.date = JalaliMoment(date, "jYYYY/jMM/jDD").toDate();
    } else if (date instanceof Date) {
      this.date = date;
    } else if ("valueOf" in date && date.valueOf() instanceof Date) {
      this.date = date.valueOf();
    } else {
      throw new Error("Invalid argument type");
    }
  }

  static getMonths(): string[] {
    return ["فروردین","اردیبهشت","خرداد","تیر","مرداد","شهریور","مهر","آبان","آذر","دی","بهمن","اسفند"];
  }

  static getDayInMonth(month: number, year: number): number {
    if (month < 7) {
      return 31;
    } else if (month < 12) {
      return 30;
    } else {
      if (JalaliMoment(`${year}-${month}-28`).jIsLeapYear()) {
        return 30;
      } else {
        return 29;
      }
    }
  }

  valueOf(): Date {
    return this.date;
  }

  format(format: string = "YYYY/MM/DD"): string {
    try {
      return JalaliMoment(this.date).locale('fa').format(format);
    } catch {
      return '-';
    }
  }

  unixDays(): number {
    return Math.floor(JalaliMoment(this.date).unix() / 86_400);
  }

  day(): number {
    return JalaliMoment(this.date).jDate();
  }

  month(): number {
    return JalaliMoment(this.date).jMonth() + 1;
  }

  year(): number {
    return JalaliMoment(this.date).jYear();
  }
}
