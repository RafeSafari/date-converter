import HijriMoment from "moment-hijri";

export default class Islamic implements iCalendar {
  date: Date;

  constructor(input?: Date | string | iCalendar | {year:number, month:number, day:number} | number[]) {
    if (typeof input === "undefined") {
      this.date = new Date();
    } else if (typeof input === "string") {
      this.date = HijriMoment(input, "iYYYY/iMM/iDD").toDate();
    } else if (Array.isArray(input)) {
      this.date = HijriMoment({ year: input[0], month: input[1], day: input[2] }).toDate();
    } else if (input instanceof Date) {
      this.date = input;
    } else if (typeof input?.year === "number" && typeof input?.month === "number" && typeof input?.day === "number") {
      this.date = HijriMoment(`${input?.year}-${input?.month}-${input?.day}`, "iYYYY-iMM-iDD").toDate();
    } else if ('valueOf' in input && typeof input.valueOf === 'function') {
      this.date = new Date(Number(input.valueOf()));
    } else {
      throw new Error("Invalid argument type");
    }
  }

  static getMonths(): {name: string, value: number}[] {
    return [
      { value: 1,  name: "المحرّم" },
      { value: 2,  name: "صفر" },
      { value: 3,  name: "ربیع الاول" },
      { value: 4,  name: "ربیع الثّانی" },
      { value: 5,  name: "جمادی الاول" },
      { value: 6,  name: "جمادی الثّانی" },
      { value: 7,  name: "رجب" },
      { value: 8,  name: "شعبان" },
      { value: 9,  name: "رمضان" },
      { value: 10, name: "شوّال" },
      { value: 11, name: "ذو القعدة" },
      { value: 12, name: "ذو الحجّة" },
    ];
  }

  static getDaysInMonth(month: number, year: number): number {
    return HijriMoment(`${year}-${month}-5`, "iYYYY-iMM-iDD").iDaysInMonth();
  }

  valueOf(): Date {
    return this.date;
  }

  format(format: string = "iYYYY/iMM/iDD"): string {
    try {
      return HijriMoment(this.date).format(format);
    } catch {
      return '-';
    }
  }

  unixDays(): number {
    return Math.floor(HijriMoment(this.date).unix() / 86_400);
  }

  day(): number {
    return HijriMoment(this.date).iDate();
  }

  month(): number {
    return HijriMoment(this.date).iMonth() + 1;
  }

  year(): number {
    return HijriMoment(this.date).iYear();
  }

  isValid(): boolean {
    if (isNaN(Number(this.format("iYYYY"))) || isNaN(Number(this.format("iM"))) || isNaN(Number(this.format("iD")))) {
      return false;
      // return "این بازه پشتیبانی نمی شود";
    }
    return true;
  }
  
  getParts(): string[] {
    return [this.format("iYYYY"), this.format("iMMMM"), this.format("iD")];
  }
}
