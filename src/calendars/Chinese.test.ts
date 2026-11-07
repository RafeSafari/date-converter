import Chinese, { CHINESE_MAX_YEAR, CHINESE_MIN_YEAR } from "./Chinese";
import Gregorian from "./Gregorian";

const toIso = (calendar: iCalendar): string =>
  new Gregorian(calendar.valueOf()).format("YYYY-MM-DD");

// Reference dates from the Taipei Central Weather Bureau lunar tables and
// lunar-javascript 1.7.8. Leap months are written as month + 12.
const references: [number, number, number, string][] = [
  [1900, 1, 1, "1900-01-31"],
  [1924, 7, 1, "1924-08-01"],
  [1925, 1, 1, "1925-01-24"],
  [1933, 17, 1, "1933-06-23"],
  [1933, 17, 30, "1933-07-22"],
  [1987, 18, 1, "1987-07-26"],
  [2024, 1, 1, "2024-02-10"],
  [2025, 1, 1, "2025-01-29"],
  [2025, 18, 1, "2025-07-25"],
  [2025, 18, 29, "2025-08-22"],
  [2033, 23, 1, "2033-12-22"],
];

describe("Chinese lunisolar calendar", () => {
  it.each(references)("converts Chinese %i/%i/%i to %s", (year, month, day, iso) => {
    expect(toIso(new Chinese({ year, month, day }))).toBe(iso);
  });

  it.each(references)("converts %s back to Chinese %i/%i/%i", (year, month, day, iso) => {
    const calendar = new Chinese(new Date(`${iso}T00:00:00`));
    expect([calendar.year(), calendar.month(), calendar.day()]).toEqual([year, month, day]);
  });

  it("lists the leap month after its regular month", () => {
    const months = Chinese.getMonths(2025);

    expect(months).toHaveLength(13);
    expect(months.map(month => month.value)).toEqual([1, 2, 3, 4, 5, 6, 18, 7, 8, 9, 10, 11, 12]);
    expect(months[6]).toEqual({ value: 18, name: "ماه 6 کبیسه" });
    expect(Chinese.getMonths(2026)).toHaveLength(12);
    expect(Chinese.getMonths(2026).some(month => month.value > 12)).toBe(false);
  });

  it("uses the corrected leap-month lengths", () => {
    expect(Chinese.getDaysInMonth(17, 1933)).toBe(30);
    expect(Chinese.getDaysInMonth(18, 1987)).toBe(29);
    expect(Chinese.getDaysInMonth(18, 2025)).toBe(29);
    expect(Chinese.getDaysInMonth(23, 2033)).toBe(29);
    expect(Chinese.getDaysInMonth(6, 2025)).toBe(30);
  });

  it("rejects leap months that the year does not have", () => {
    expect(new Chinese({ year: 2025, month: 18, day: 30 }).isValid()).toBe(false);
    expect(new Chinese({ year: 2026, month: 18, day: 1 }).isValid()).toBe(false);
    expect(new Chinese({ year: 2025, month: 17, day: 1 }).isValid()).toBe(false);
    expect(new Chinese({ year: 2025, month: 13, day: 1 }).isValid()).toBe(false);
    expect(Chinese.getDaysInMonth(18, 2026)).toBe(0);
  });

  it("rejects dates outside the 1900-2100 table", () => {
    expect(new Chinese(new Date(1899, 11, 31)).isValid()).toBe(false);
    expect(new Chinese(new Date(1900, 0, 30)).isValid()).toBe(false);
    expect(new Chinese(new Date(1900, 0, 31)).isValid()).toBe(true);
    expect(new Chinese({ year: CHINESE_MIN_YEAR - 1, month: 1, day: 1 }).isValid()).toBe(false);
    expect(new Chinese({ year: CHINESE_MAX_YEAR + 1, month: 1, day: 1 }).isValid()).toBe(false);
    expect(new Chinese(new Date(2101, 5, 1)).isValid()).toBe(false);

    expect(Chinese.getDaysInMonth(1, 1899)).toBe(0);
    expect(Chinese.getDaysInMonth(1, 2101)).toBe(0);
    expect(Chinese.getDaysInMonth(0, 2025)).toBe(0);
    expect(Chinese.getDaysInMonth(13, 2025)).toBe(0);
  });

  it("round-trips every day of the recent 100 years", () => {
    const end = new Date(2025, 11, 31);
    const mismatches: string[] = [];
    let count = 0;
    let cursor = new Date(1925, 0, 1);

    while (cursor <= end) {
      const expected = [cursor.getFullYear(), cursor.getMonth() + 1, cursor.getDate()];
      const calendar = new Chinese(cursor);

      if (!calendar.isValid()) {
        mismatches.push(`invalid: ${expected.join("-")}`);
      } else {
        const back = new Chinese({
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
    const expected = "2025-07-25";

    expect(toIso(new Chinese([2025, 18, 1]))).toBe(expected);
    expect(toIso(new Chinese("2025/18/1"))).toBe(expected);
    expect(toIso(new Chinese("2025-18-01"))).toBe(expected);
    expect(toIso(new Chinese("۲۰۲۵/۱۸/۱"))).toBe(expected);
    expect(toIso(new Chinese("٢٠٢٥/١٨/١"))).toBe(expected);
  });

  it("formats Chinese tokens and reports unix days", () => {
    const calendar = new Chinese({ year: 2025, month: 18, day: 1 });

    expect(calendar.format()).toBe("2025/18/01");
    expect(calendar.format("cD cMMMM cYYYY")).toBe("1 ماه 6 کبیسه 2025");
    expect(calendar.format("cDD-cMM-cYY")).toBe("01-18-25");
    expect(calendar.unixDays()).toBe(
      Math.floor(Date.UTC(2025, 6, 25) / 86_400_000),
    );
    expect(calendar.getParts()).toEqual(["2025", "ماه 6 کبیسه", "1"]);
  });

  it("reports invalid dates safely", () => {
    const invalid = new Chinese(new Date(NaN));

    expect(invalid.isValid()).toBe(false);
    expect(invalid.format()).toBe("-");
    expect(invalid.getParts()).toEqual(["-", "-", "-"]);
    expect(Number.isNaN(invalid.unixDays())).toBe(true);
  });
});
