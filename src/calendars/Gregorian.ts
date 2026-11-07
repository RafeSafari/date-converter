import moment from "moment";

const DAY_MS = 86_400_000;

export default class Gregorian implements iCalendar {
  date: Date;

  constructor(input?: Date | string | iCalendar | {year:number, month:number, day:number} | number[]) {
    if (typeof input === "undefined") {
      this.date = new Date();
    } else if (typeof input === "string") {
      this.date = moment(input).toDate();
    } else if (Array.isArray(input)) {
      this.date = moment({ year: input[0], month: input[1] - 1, day: input[2] }).toDate();
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
    if (!Number.isInteger(month) || month < 1 || month > 12 || !Number.isInteger(year)) {
      return 0;
    }
    return moment({ year, month: month - 1 }).daysInMonth();
  }

  valueOf(): Date {
    return this.date;
  }

  format(format: string = "YYYY/MM/DD"): string {
    return moment(this.date).locale("en").format(format);
  }

  unixDays(): number {
    if (isNaN(this.date.getTime())) {
      return NaN;
    }
    return Math.floor(Date.UTC(this.date.getFullYear(), this.date.getMonth(), this.date.getDate()) / DAY_MS);
  }

  day(): number {
    return this.date.getDate();
  }

  month(): number {
    return this.date.getMonth() + 1;
  }

  year(): number {
    return this.date.getFullYear();
  }

  isValid(): boolean {
    return !isNaN(this.date.getTime());
  }
  
  getParts(): string[] {
    return this.format("YYYY MMMM D").split(" ");
  }
}
