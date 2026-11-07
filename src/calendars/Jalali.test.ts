import Jalali from "./Jalali";
import Gregorian from "./Gregorian";

const toIso = (calendar: iCalendar): string =>
  new Gregorian(calendar.valueOf()).format("YYYY-MM-DD");

const references: [number, number, number, string][] = [
  [1304, 1, 1, "1925-03-21"],
  [1355, 1, 1, "1976-03-21"],
  [1403, 12, 30, "2025-03-20"],
  [1404, 1, 1, "2025-03-21"],
  [1404, 8, 16, "2025-11-07"],
];

describe("Jalali calendar", () => {
  it.each(references)("converts Jalali %i/%i/%i to %s", (year, month, day, iso) => {
    expect(toIso(new Jalali({ year, month, day }))).toBe(iso);
  });

  it.each(references)("converts %s back to Jalali %i/%i/%i", (year, month, day, iso) => {
    const calendar = new Jalali(new Date(`${iso}T00:00:00`));
    expect([calendar.year(), calendar.month(), calendar.day()]).toEqual([year, month, day]);
  });

  it("accepts date parts as arrays, strings and objects consistently", () => {
    const expected = ["2025-11-07", "2025-03-21", "1925-03-21"];
    const inputs: Array<[unknown, string]> = [
      [{ year: 1404, month: 8, day: 16 }, expected[0]],
      [[1404, 8, 16], expected[0]],
      ["1404/8/16", expected[0]],
      ["1404-08-16", expected[0]],
      ["۱۴۰۴/۸/۱۶", expected[0]],
      ["١٤٠٤/٨/١٦", expected[0]],
      [{ year: 1404, month: 1, day: 1 }, expected[1]],
      [{ year: 1304, month: 1, day: 1 }, expected[2]],
    ];

    for (const [input, iso] of inputs) {
      expect(toIso(new Jalali(input as never))).toBe(iso);
    }
  });

  it("knows leap years through Esfand", () => {
    expect(Jalali.getDaysInMonth(12, 1403)).toBe(30);
    expect(Jalali.getDaysInMonth(12, 1404)).toBe(29);
    expect(Jalali.getDaysInMonth(12, 1402)).toBe(29);
    expect(Jalali.getDaysInMonth(1, 1404)).toBe(31);
    expect(Jalali.getDaysInMonth(6, 1404)).toBe(31);
    expect(Jalali.getDaysInMonth(7, 1404)).toBe(30);
  });

  it("rejects days beyond the end of the month", () => {
    expect(new Jalali({ year: 1403, month: 12, day: 30 }).isValid()).toBe(true);
    expect(new Jalali({ year: 1404, month: 12, day: 30 }).isValid()).toBe(false);
    expect(new Jalali({ year: 1404, month: 1, day: 32 }).isValid()).toBe(false);
    expect(new Jalali({ year: 1404, month: 1, day: 0 }).isValid()).toBe(false);
  });

  it("rejects invalid months and unparseable strings", () => {
    expect(Jalali.getDaysInMonth(0, 1404)).toBe(0);
    expect(Jalali.getDaysInMonth(13, 1404)).toBe(0);
    expect(new Jalali({ year: 1404, month: 13, day: 1 }).isValid()).toBe(false);
    expect(new Jalali({ year: 1404, month: 0, day: 1 }).isValid()).toBe(false);
    expect(new Jalali("not a date").isValid()).toBe(false);
  });

  it("matches Gregorian unix days", () => {
    const jalali = new Jalali({ year: 1404, month: 8, day: 16 });
    const gregorian = new Gregorian(new Date("2025-11-07T00:00:00"));
    expect(jalali.unixDays()).toBe(gregorian.unixDays());
  });

  it("round-trips every day of the last 100 years through Gregorian", () => {
    const DAY_MS = 86_400_000;
    const start = Date.UTC(1925, 0, 1);
    const end = Date.UTC(2025, 11, 31);
    let mismatches = 0;
    let checked = 0;

    for (let time = start; time <= end; time += DAY_MS) {
      const utc = new Date(time);
      const date = new Date(utc.getUTCFullYear(), utc.getUTCMonth(), utc.getUTCDate());
      const jalali = new Jalali(date);
      if (!jalali.isValid()) {
        mismatches++;
        continue;
      }
      const back = new Jalali({ year: jalali.year(), month: jalali.month(), day: jalali.day() });
      if (
        back.valueOf().getFullYear() !== date.getFullYear() ||
        back.valueOf().getMonth() !== date.getMonth() ||
        back.valueOf().getDate() !== date.getDate()
      ) {
        mismatches++;
      }
      checked++;
    }

    expect(checked).toBeGreaterThan(36_000);
    expect(mismatches).toBe(0);
  });

  it("formats with Persian month names and zero padding", () => {
    const calendar = new Jalali({ year: 1404, month: 8, day: 16 });
    expect(calendar.getParts()).toEqual(["1404", "آبان", "16"]);
    expect(calendar.format("jD jMMMM jYYYY")).toBe("16 آبان 1404");
    expect(calendar.format("jYYYY/jMM/jDD")).toBe("1404/08/16");
    expect(calendar.format("jYY")).toBe("04");
  });

  it("formats and reports invalid dates safely", () => {
    const invalid = new Jalali(new Date(NaN));
    expect(invalid.isValid()).toBe(false);
    expect(invalid.getParts()).toEqual(["-", "-", "-"]);
    expect(Number.isNaN(invalid.unixDays())).toBe(true);
    expect(Number.isNaN(invalid.year())).toBe(true);
  });

  it("reports dates outside the supported range instead of throwing", () => {
    const ancient = new Date(0);
    ancient.setUTCFullYear(0, 0, 1);
    const calendar = new Jalali(ancient);
    expect(() => calendar.isValid()).not.toThrow();
    expect(calendar.isValid()).toBe(false);
    expect(calendar.getParts()).toEqual(["-", "-", "-"]);
    expect(Number.isNaN(calendar.year())).toBe(true);
  });
});
