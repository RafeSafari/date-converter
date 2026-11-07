import Hindu from "./Hindu";
import Gregorian from "./Gregorian";

const toIso = (calendar: iCalendar): string =>
  new Gregorian(calendar.valueOf()).format("YYYY-MM-DD");

const references: [number, number, number, string][] = [
  [1821, 10, 10, "1899-12-31"],
  [1846, 5, 10, "1924-08-01"],
  [1869, 5, 24, "1947-08-15"],
  [1946, 1, 1, "2024-03-21"],
  [1946, 11, 6, "2025-01-26"],
  [1947, 1, 1, "2025-03-22"],
  [1947, 8, 16, "2025-11-07"],
  [1948, 1, 1, "2026-03-22"],
];

describe("Saka (Indian national) calendar", () => {
  it.each(references)("converts Saka %i/%i/%i to %s", (year, month, day, iso) => {
    expect(toIso(new Hindu({ year, month, day }))).toBe(iso);
  });

  it.each(references)("converts %s back to Saka %i/%i/%i", (year, month, day, iso) => {
    const calendar = new Hindu(new Date(`${iso}T00:00:00`));
    expect([calendar.year(), calendar.month(), calendar.day()]).toEqual([year, month, day]);
  });

  it("starts Chaitra on 22 March, or 21 March before a Gregorian leap year", () => {
    expect(toIso(new Hindu({ year: 1946, month: 1, day: 1 }))).toBe("2024-03-21");
    expect(toIso(new Hindu({ year: 1947, month: 1, day: 1 }))).toBe("2025-03-22");
    expect(toIso(new Hindu({ year: 1948, month: 1, day: 1 }))).toBe("2026-03-22");

    expect(Hindu.getDaysInMonth(1, 1946)).toBe(31);
    expect(Hindu.getDaysInMonth(1, 1947)).toBe(30);
    for (let month = 2; month <= 6; month += 1) {
      expect(Hindu.getDaysInMonth(month, 1947)).toBe(31);
    }
    for (let month = 7; month <= 12; month += 1) {
      expect(Hindu.getDaysInMonth(month, 1947)).toBe(30);
    }
  });

  it("always yields 365 or 366 day years", () => {
    for (let year = 1900; year <= 2000; year += 1) {
      const length = Array.from({ length: 12 }, (_, index) =>
        Hindu.getDaysInMonth(index + 1, year),
      ).reduce((total, days) => total + days, 0);

      expect([365, 366]).toContain(length);
    }
  });

  it("rejects invalid dates, months and years", () => {
    expect(new Hindu({ year: 1947, month: 1, day: 31 }).isValid()).toBe(false);
    expect(new Hindu({ year: 1946, month: 1, day: 32 }).isValid()).toBe(false);
    expect(new Hindu({ year: 1947, month: 13, day: 1 }).isValid()).toBe(false);
    expect(new Hindu({ year: 1947, month: 0, day: 1 }).isValid()).toBe(false);
    expect(new Hindu({ year: 0, month: 1, day: 1 }).isValid()).toBe(false);
    expect(new Hindu({ year: 10000, month: 1, day: 1 }).isValid()).toBe(false);
    expect(new Hindu("not a date").isValid()).toBe(false);

    expect(Hindu.getDaysInMonth(0, 1947)).toBe(0);
    expect(Hindu.getDaysInMonth(13, 1947)).toBe(0);
    expect(Hindu.getDaysInMonth(1, 0)).toBe(0);
  });

  it("round-trips every day of the recent 100 years", () => {
    const end = new Date(2025, 11, 31);
    const mismatches: string[] = [];
    let count = 0;
    let cursor = new Date(1925, 0, 1);

    while (cursor <= end) {
      const expected = [cursor.getFullYear(), cursor.getMonth() + 1, cursor.getDate()];
      const calendar = new Hindu(cursor);

      if (!calendar.isValid()) {
        mismatches.push(`invalid: ${expected.join("-")}`);
      } else {
        const back = new Hindu({
          year: calendar.year(),
          month: calendar.month(),
          day: calendar.day(),
        });
        const actual = back.valueOf();
        if (
          actual.getFullYear() !== expected[0] ||
          actual.getMonth() + 1 !== expected[1] ||
          actual.getDate() !== expected[2]
        ) {
          mismatches.push(`${expected.join("-")} -> ${calendar.format()}`);
        }
      }

      count += 1;
      cursor = new Date(expected[0], expected[1] - 1, expected[2] + 1);
    }

    expect(count).toBeGreaterThan(36_000);
    expect(mismatches.slice(0, 5)).toEqual([]);
  });

  it("accepts date parts as arrays, strings and objects consistently", () => {
    const expected = "2025-03-22";

    expect(toIso(new Hindu([1947, 1, 1]))).toBe(expected);
    expect(toIso(new Hindu("1947/1/1"))).toBe(expected);
    expect(toIso(new Hindu("1947-01-01"))).toBe(expected);
    expect(toIso(new Hindu("۱۹۴۷/۱/۱"))).toBe(expected);
    expect(toIso(new Hindu("١٩٤٧/١/١"))).toBe(expected);
  });

  it("formats Saka tokens and reports unix days", () => {
    const calendar = new Hindu({ year: 1947, month: 1, day: 1 });

    expect(calendar.format()).toBe("1947/01/01");
    expect(calendar.format("sD sMMMM sYYYY")).toBe("1 چایترا 1947");
    expect(calendar.format("sDD-sMM-sYY")).toBe("01-01-47");
    expect(calendar.unixDays()).toBe(
      Math.floor(Date.UTC(2025, 2, 22) / 86_400_000),
    );
    expect(calendar.getParts()).toEqual(["1947", "چایترا", "1"]);
  });

  it("reports invalid dates safely", () => {
    const invalid = new Hindu(new Date(NaN));

    expect(invalid.isValid()).toBe(false);
    expect(invalid.format()).toBe("-");
    expect(invalid.getParts()).toEqual(["-", "-", "-"]);
    expect(Number.isNaN(invalid.unixDays())).toBe(true);
  });
});
