import JalaliMoment from "jalali-moment";

export default class Jalali implements iCalendar {
  date: Date;

  constructor(input?: Date | string | iCalendar | {year:number, month:number, day:number} | number[]) {
    if (typeof input === "undefined") {
      this.date = new Date();
    } else if (typeof input === "string") {
      this.date = JalaliMoment(input, "jYYYY/jMM/jDD").toDate();
    } else if (Array.isArray(input)) {
      this.date = JalaliMoment(`${input[0]}-${input[1]}-${input[2]}`, "jYYYY-jMM-jDD").toDate();
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

  static getMonths(): {name: string, value: number}[] {
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
    return JalaliMoment(`${year}-${month}-20`, "jYYYY/jMM/jDD").jDaysInMonth();
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

  isValid(): boolean {
    return !isNaN(Number(this.format("jYYYY", "en"))) && !isNaN(Number(this.format("jM", "en"))) && !isNaN(Number(this.format("jD", "en")));
  }
  
  getParts(): string[] {
    return this.format("jYYYY jMMMM jD").split(" ");
  }
}
