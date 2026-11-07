import Badi from "./Badi";
import Gregorian from "./Gregorian";

const toIso = (calendar: iCalendar): string =>
  new Gregorian(calendar.valueOf()).format("YYYY-MM-DD");

const ISO_DAY_MS = 86_400_000;

const references: [number, number, number, string][] = [
  [1, 1, 1, "1844-03-21"],
  [1, 1, 19, "1844-04-08"],
  [1, 18, 19, "1845-02-25"],
  [1, 20, 1, "1845-02-26"],
  [1, 20, 4, "1845-03-01"],
  [1, 19, 1, "1845-03-02"],
  [1, 19, 19, "1845-03-20"],
  [2, 1, 1, "1845-03-21"],
  [4, 20, 5, "1848-03-01"],
  [56, 20, 4, "1900-03-01"],
  [57, 1, 1, "1900-03-21"],
  [172, 1, 1, "2015-03-21"],
  [180, 19, 19, "2024-03-19"],
  [181, 1, 1, "2024-03-20"],
  [181, 18, 19, "2025-02-24"],
  [181, 20, 1, "2025-02-25"],
  [181, 20, 2, "2025-02-26"],
  [181, 20, 4, "2025-02-28"],
  [181, 19, 1, "2025-03-01"],
  [181, 19, 19, "2025-03-19"],
  [182, 1, 1, "2025-03-20"],
  [182, 20, 1, "2026-02-25"],
  [182, 20, 5, "2026-03-01"],
  [182, 19, 19, "2026-03-20"],
  [183, 1, 1, "2026-03-21"],
];

describe("Badi calendar", () => {
  it.each(references)("converts Badi %i/%i/%i to %s", (year, month, day, iso) => {
    expect(toIso(new Badi({ year, month, day }))).toBe(iso);
  });

  it.each(references)("converts %s back to Badi %i/%i/%i", (year, month, day, iso) => {
    const calendar = new Badi(new Date(`${iso}T00:00:00`));
    expect([calendar.year(), calendar.month(), calendar.day()]).toEqual([year, month, day]);
  });

  it("keeps all 19 regular months at 19 days", () => {
    for (let month = 1; month <= 19; month++) {
      expect(Badi.getDaysInMonth(month, 181)).toBe(19);
      expect(Badi.getDaysInMonth(month, 182)).toBe(19);
    }
  });

  it("knows the length of Ayyam-i-Ha in each year", () => {
    expect(Badi.getDaysInMonth(20, 1)).toBe(4);
    expect(Badi.getDaysInMonth(20, 4)).toBe(5);
    expect(Badi.getDaysInMonth(20, 56)).toBe(4);
    expect(Badi.getDaysInMonth(20, 57)).toBe(4);
    expect(Badi.getDaysInMonth(20, 181)).toBe(4);
    expect(Badi.getDaysInMonth(20, 182)).toBe(5);
  });

  it("rejects a fifth Ayyam-i-Ha day in a 4-day year", () => {
    expect(new Badi({ year: 181, month: 20, day: 5 }).isValid()).toBe(false);
    expect(new Badi({ year: 181, month: 20, day: 4 }).isValid()).toBe(true);
  });

  it("rejects invalid months and days", () => {
    expect(Badi.getDaysInMonth(0, 181)).toBe(0);
    expect(Badi.getDaysInMonth(21, 181)).toBe(0);
    expect(Badi.getDaysInMonth(1, 0)).toBe(0);
    expect(new Badi({ year: 181, month: 0, day: 1 }).isValid()).toBe(false);
    expect(new Badi({ year: 181, month: 21, day: 1 }).isValid()).toBe(false);
    expect(new Badi({ year: 181, month: 1, day: 20 }).isValid()).toBe(false);
    expect(new Badi({ year: 0, month: 1, day: 1 }).isValid()).toBe(false);
    expect(new Badi({ year: -1, month: 1, day: 1 }).isValid()).toBe(false);
    expect(new Badi({ year: 508, month: 1, day: 1 }).isValid()).toBe(false);
    expect(new Badi(new Date("1844-03-20T00:00:00")).isValid()).toBe(false);
  });

  it("accepts date parts as arrays, strings and objects consistently", () => {
    const expected = ["2025-03-20", "2026-03-21", "2025-02-28"];
    const inputs: Array<[unknown, string]> = [
      [{ year: 182, month: 1, day: 1 }, expected[0]],
      [[182, 1, 1], expected[0]],
      ["182/1/1", expected[0]],
      ["182-01-01", expected[0]],
      ["۱۸۲/۱/۱", expected[0]],
      ["١٨٢/١/١", expected[0]],
      [{ year: 183, month: 1, day: 1 }, expected[1]],
      [{ year: 181, month: 20, day: 4 }, expected[2]],
    ];

    for (const [input, iso] of inputs) {
      expect(toIso(new Badi(input as never))).toBe(iso);
    }
  });

  it("maps the Badi epoch to 21 March 1844 for every input form", () => {
    expect(toIso(new Badi({ year: 1, month: 1, day: 1 }))).toBe("1844-03-21");
    expect(toIso(new Badi([1, 1, 1]))).toBe("1844-03-21");
    expect(toIso(new Badi("1/1/1"))).toBe("1844-03-21");
  });

  it("matches Gregorian unix days", () => {
    const badi = new Badi({ year: 181, month: 1, day: 1 });
    const gregorian = new Gregorian(new Date("2024-03-20T00:00:00"));
    expect(badi.unixDays()).toBe(gregorian.unixDays());
    expect(badi.unixDays()).toBe(Math.floor(Date.UTC(2024, 2, 20) / ISO_DAY_MS));
  });

  it("round-trips every day from the Badi epoch through Gregorian", () => {
    const start = Date.UTC(1844, 2, 21);
    const end = Date.UTC(2025, 11, 31);
    let mismatches = 0;
    let checked = 0;

    for (let time = start; time <= end; time += ISO_DAY_MS) {
      const date = new Date(time);
      const badi = new Badi(date);
      if (!badi.isValid()) {
        mismatches++;
        continue;
      }
      const back = new Badi({ year: badi.year(), month: badi.month(), day: badi.day() });
      const expected = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      if (back.valueOf().getTime() !== expected.getTime()) {
        mismatches++;
      }
      checked++;
    }

    expect(checked).toBeGreaterThan(66_000);
    expect(mismatches).toBe(0);
  });

  it("keeps getParts at exactly three elements for Ayyam-i-Ha", () => {
    const parts = new Badi({ year: 181, month: 20, day: 1 }).getParts();
    expect(parts).toHaveLength(3);
    expect(parts).toEqual(["181", "ایام هاء", "1"]);
  });

  it("lists months in calendar order with Ayyam-i-Ha before the last month", () => {
    const months = Badi.getMonths();

    expect(months).toHaveLength(20);
    expect(months.slice(0, 18).map(month => month.value)).toEqual(
      Array.from({ length: 18 }, (_, index) => index + 1),
    );
    expect(months[18].value).toBe(20);
    expect(months[19].value).toBe(19);
    expect(new Set(months.map(month => month.value)).size).toBe(20);
  });

  it("formats and reports invalid dates safely", () => {
    const invalid = new Badi(new Date(NaN));
    expect(invalid.isValid()).toBe(false);
    expect(invalid.format("y m d")).toBe("-");
    expect(invalid.getParts()).toEqual(["-", "-", "-"]);
    expect(Number.isNaN(invalid.unixDays())).toBe(true);
  });
});
