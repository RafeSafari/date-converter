import iCalendar from "./iCalendar";
import moment from "moment";

export default class Gregorian implements iCalendar {
  date: Date;

  constructor(date?: Date | string | iCalendar) {
    if (typeof date === "undefined") {
      this.date = new Date();
    } else if (typeof date === "string") {
      this.date = moment(date).toDate();
    } else if (date instanceof Date) {
      this.date = date;
    } else if ("valueOf" in date && date.valueOf() instanceof Date) {
      this.date = date.valueOf();
    } else {
      throw new Error("Invalid argument type");
    }
  }

  static getMonths(): string[] {
    return moment.months();
  }

  static getDayInMonth(month: number, year: number): number {
    return moment().year(year).month(month - 1).daysInMonth();
  }

  valueOf(): Date {
    return this.date;
  }

  format(format: string = "YYYY/MM/DD"): string {
    return moment(this.date).format(format);
  }

  unixDays(): number {
    return Math.floor(moment(this.date).unix() / 86_400);
  }

  day(): number {
    return moment(this.date).date();
  }

  month(): number {
    return moment(this.date).month() + 1;
  }

  year(): number {
    return moment(this.date).year();
  }
}
