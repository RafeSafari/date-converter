import Hebrew from "./Hebrew";
import Gregorian from "./Gregorian";

const toIso = (calendar: iCalendar): string =>
  new Gregorian(calendar.valueOf()).format("YYYY-MM-DD");

// Months use the civil (Tishrei-first) order; Adar I is 6 and Adar II is 7.
const references: [number, number, number, string][] = [
  [5684, 12, 1, "1924-08-01"],
  [5784, 1, 1, "2023-09-16"],
  [5784, 6, 1, "2024-02-10"],
  [5784, 8, 15, "2024-04-23"],
  [5785, 1, 1, "2024-10-03"],
  [5785, 7, 15, "2025-04-13"],
  [5786, 1, 1, "2025-09-23"],
];

describe("Hebrew arithmetic calendar", () => {
  it.each(references)("converts Hebrew %i/%i/%i to %s", (year, month, day, iso) => {
    expect(toIso(new Hebrew({ year, month, day }))).toBe(iso);
  });

  it.each(references)("converts %s back to Hebrew %i/%i/%i", (year, month, day, iso) => {
    const calendar = new Hebrew(new Date(`${iso}T00:00:00`));
    expect([calendar.year(), calendar.month(), calendar.day()]).toEqual([year, month, day]);
  });

  it("lists Adar I and Adar II only in leap years", () => {
    const leap = Hebrew.getMonths(5784);
    const common = Hebrew.getMonths(5785);

    expect(leap).toHaveLength(13);
    expect(common).toHaveLength(12);
    expect(leap[5]).toEqual({ value: 6, name: "آدار الف" });
    expect(leap[6]).toEqual({ value: 7, name: "آدار ب" });
    expect(leap[7].name).toBe("نیسان");
    expect(common[5]).toEqual({ value: 6, name: "آدار" });
    expect(common[6].name).toBe("نیسان");
  });

  it("computes Heshvan and Kislev from the year length", () => {
    // 5784 is a deficient leap year (383 days): Heshvan and Kislev are short.
    expect(Hebrew.getDaysInMonth(1, 5784)).toBe(30);
    expect(Hebrew.getDaysInMonth(2, 5784)).toBe(29);
    expect(Hebrew.getDaysInMonth(3, 5784)).toBe(29);

    // 5785 is a complete common year (355 days): both are long.
    expect(Hebrew.getDaysInMonth(2, 5785)).toBe(30);
    expect(Hebrew.getDaysInMonth(3, 5785)).toBe(30);

    expect(Hebrew.getDaysInMonth(6, 5784)).toBe(30);
    expect(Hebrew.getDaysInMonth(7, 5784)).toBe(29);
    expect(Hebrew.getDaysInMonth(6, 5785)).toBe(29);
    expect(Hebrew.getDaysInMonth(7, 5785)).toBe(30);
  });

  it("rejects invalid dates, months and years", () => {
    expect(new Hebrew({ year: 5784, month: 2, day: 30 }).isValid()).toBe(false);
    expect(new Hebrew({ year: 5785, month: 13, day: 1 }).isValid()).toBe(false);
    expect(new Hebrew({ year: 5784, month: 14, day: 1 }).isValid()).toBe(false);
    expect(new Hebrew({ year: 5785, month: 0, day: 1 }).isValid()).toBe(false);
    expect(new Hebrew({ year: 0, month: 1, day: 1 }).isValid()).toBe(false);
    expect(new Hebrew({ year: 10000, month: 1, day: 1 }).isValid()).toBe(false);
    expect(new Hebrew("not a date").isValid()).toBe(false);

    expect(Hebrew.getDaysInMonth(14, 5784)).toBe(0);
    expect(Hebrew.getDaysInMonth(13, 5785)).toBe(0);
    expect(Hebrew.getDaysInMonth(1, 0)).toBe(0);
  });

  it("round-trips every day of the recent 100 years", () => {
    const end = new Date(2025, 11, 31);
    const mismatches: string[] = [];
    let count = 0;
    let cursor = new Date(1925, 0, 1);

    while (cursor <= end) {
      const expected = [cursor.getFullYear(), cursor.getMonth() + 1, cursor.getDate()];
      const calendar = new Hebrew(cursor);

      if (!calendar.isValid()) {
        mismatches.push(`invalid: ${expected.join("-")}`);
      } else {
        const back = new Hebrew({
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
    const expected = "2024-02-10";

    expect(toIso(new Hebrew([5784, 6, 1]))).toBe(expected);
    expect(toIso(new Hebrew("5784/6/1"))).toBe(expected);
    expect(toIso(new Hebrew("5784-06-01"))).toBe(expected);
    expect(toIso(new Hebrew("۵۷۸۴/۶/۱"))).toBe(expected);
    expect(toIso(new Hebrew("٥٧٨٤/٦/١"))).toBe(expected);
  });

  it("formats Hebrew tokens and reports unix days", () => {
    const calendar = new Hebrew({ year: 5784, month: 6, day: 1 });

    expect(calendar.format()).toBe("5784/06/01");
    expect(calendar.format("hD hMMMM hYYYY")).toBe("1 آدار الف 5784");
    expect(calendar.format("hDD-hMM-hYY")).toBe("01-06-84");
    expect(calendar.unixDays()).toBe(
      Math.floor(Date.UTC(2024, 1, 10) / 86_400_000),
    );
    expect(calendar.getParts()).toEqual(["5784", "آدار الف", "1"]);
  });

  it("reports invalid dates safely", () => {
    const invalid = new Hebrew(new Date(NaN));

    expect(invalid.isValid()).toBe(false);
    expect(invalid.format()).toBe("-");
    expect(invalid.getParts()).toEqual(["-", "-", "-"]);
    expect(Number.isNaN(invalid.unixDays())).toBe(true);
  });
});
