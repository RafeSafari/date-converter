import JalaliMoment from "jalali-moment";

export default class Jalali implements iCalendar {
  date: Date;

  constructor(input?: Date | string | iCalendar | {year:number, month:number, day:number} | number[]) {
    if (typeof input === "undefined") {
      this.date = new Date();
    } else if (typeof input === "string") {
      this.date = JalaliMoment(input, "jYYYY/jMM/jDD").toDate();
    } else if (Array.isArray(input)) {
      this.date = JalaliMoment({ year: input[0], month: input[1], day: input[2] }).toDate();
    } else if (input instanceof Date) {
      this.date = input;
    } else if (typeof input?.year === "number" && typeof input?.month === "number" && typeof input?.day === "number") {
      this.date = JalaliMoment(`${input?.year}-${input?.month}-${input?.day}`, "jYYYY-jMM-jDD").toDate();
    } else if ('valueOf' in input && typeof input.valueOf === 'function') {
      this.date = new Date(Number(input.valueOf()));
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

  getParts(): string[] {
    return this.format("YYYY MMMM D").split(" ");
  }
}
