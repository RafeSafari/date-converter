import moment from "moment";

export default class Gregorian implements iCalendar {
  date: Date;

  constructor(input?: Date | string | iCalendar | {year:number, month:number, day:number} | number[]) {
    if (typeof input === "undefined") {
      this.date = new Date();
    } else if (typeof input === "string") {
      this.date = moment(input).toDate();
    } else if (Array.isArray(input)) {
      this.date = moment({ year: input[0], month: input[1], day: input[2] }).toDate();
    } else if (input instanceof Date) {
      this.date = input;
    } else if (typeof input?.year === "number" && typeof input?.month === "number" && typeof input?.day === "number") {
      this.date = moment({ year: input?.year, month: input?.month-1, day: input?.day }).toDate();
    } else if ('valueOf' in input && typeof input.valueOf === 'function') {
      this.date = new Date(Number(input.valueOf()));
    } else {
      throw new Error("Invalid argument type");
    }
  }

  static getMonths(): {name: string, value: number}[] {
    return moment.months().map((month, i) => ({
      value: i+1,
      name: month,
    }));
  }

  static getDaysInMonth(month: number, year: number): number {
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

  isValid(): boolean {
    return !isNaN(Number(this.format("YYYY"))) && !isNaN(Number(this.format("M"))) && !isNaN(Number(this.format("D")));
  }
  
  getParts(): string[] {
    return this.format("YYYY MMMM D").split(" ");
  }
}
