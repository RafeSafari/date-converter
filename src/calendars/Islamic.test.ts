import Gregorian from "./Gregorian";
import Islamic from "./Islamic";

const toIso = (calendar: iCalendar): string => new Gregorian(calendar.valueOf()).format("YYYY-MM-DD");

// Reference dates verified against the official Umm al-Qura tables
// (archived newspaper issues 1343-1355 AH, KFUPM 1356-1411 AH, KACST 1451-1500 AH).
const REFERENCES: [number, number, number, string][] = [
  [1343, 1, 1, "1924-08-02"],
  [1356, 1, 1, "1937-03-14"],
  [1427, 5, 30, "2006-06-26"],
  [1427, 6, 1, "2006-06-27"],
  [1445, 1, 1, "2023-07-19"],
  [1446, 1, 1, "2024-07-07"],
  [1446, 9, 1, "2025-03-01"],
  [1447, 1, 1, "2025-06-26"],
  [1447, 9, 1, "2026-02-18"],
  [1500, 12, 30, "2077-11-16"],
];

test.each(REFERENCES)("%i/%i/%i corresponds to %s", (year, month, day, iso) => {
  const calendar = new Islamic({ year, month, day });

  expect(calendar.isValid()).toBe(true);
  expect(toIso(calendar)).toBe(iso);
  expect(calendar.year()).toBe(year);
  expect(calendar.month()).toBe(month);
  expect(calendar.day()).toBe(day);
  expect(calendar.getParts()).toEqual([String(year), Islamic.getMonths()[month - 1].name, String(day)]);
  expect(toIso(new Islamic(calendar.date))).toBe(iso);
});

test.each(REFERENCES)("Gregorian %s converts back to %i/%i/%i", (year, month, day, iso) => {
  const calendar = new Islamic(new Gregorian(iso).valueOf());

  expect(calendar.isValid()).toBe(true);
  expect([calendar.year(), calendar.month(), calendar.day()]).toEqual([year, month, day]);
});

test("round-trips every day of the recent 100 years", () => {
  const end = new Date(2025, 11, 31);
  const mismatches: string[] = [];
  let count = 0;
  let cursor = new Date(1925, 0, 1);

  while (cursor <= end) {
    const expected = [cursor.getFullYear(), cursor.getMonth() + 1, cursor.getDate()];
    const calendar = new Islamic(cursor);

    if (!calendar.isValid()) {
      mismatches.push(`invalid: ${expected.join("-")}`);
    } else {
      const actual = calendar.valueOf();
      if (
        actual.getFullYear() !== expected[0] ||
        actual.getMonth() + 1 !== expected[1] ||
        actual.getDate() !== expected[2]
      ) {
        mismatches.push(`${expected.join("-")} -> ${actual.toISOString()} (${calendar.format()})`);
      }
    }

    count += 1;
    cursor = new Date(expected[0], expected[1] - 1, expected[2] + 1);
  }

  expect(count).toBeGreaterThan(36_000);
  expect(mismatches.slice(0, 5)).toEqual([]);
});

test("parses object, array, string and Persian-digit inputs identically", () => {
  const expected = "2025-03-01";

  expect(toIso(new Islamic({ year: 1446, month: 9, day: 1 }))).toBe(expected);
  expect(toIso(new Islamic([1446, 9, 1]))).toBe(expected);
  expect(toIso(new Islamic("1446/9/1"))).toBe(expected);
  expect(toIso(new Islamic("1446-09-01"))).toBe(expected);
  expect(toIso(new Islamic("١٤٤٦/٠٩/٠١"))).toBe(expected);
});

test("month lengths come from the Umm al-Qura data", () => {
  expect(Islamic.getDaysInMonth(5, 1427)).toBe(30);
  expect(Islamic.getDaysInMonth(6, 1427)).toBe(29);
  expect(Islamic.getDaysInMonth(9, 1446)).toBe(29);

  for (let year = 1343; year <= 1500; year += 1) {
    let yearLength = 0;
    for (let month = 1; month <= 12; month += 1) {
      const length = Islamic.getDaysInMonth(month, year);
      expect([29, 30]).toContain(length);
      yearLength += length;
    }
    expect([354, 355]).toContain(yearLength);
  }
});

test("rejects invalid and out-of-range dates", () => {
  expect(new Islamic({ year: 1446, month: 9, day: 31 }).isValid()).toBe(false);
  expect(new Islamic({ year: 1446, month: 13, day: 1 }).isValid()).toBe(false);
  expect(new Islamic({ year: 1446, month: 0, day: 1 }).isValid()).toBe(false);
  expect(new Islamic({ year: 1342, month: 12, day: 29 }).isValid()).toBe(false);
  expect(new Islamic({ year: 1501, month: 1, day: 1 }).isValid()).toBe(false);
  expect(new Islamic("not a date").isValid()).toBe(false);

  expect(Islamic.getDaysInMonth(0, 1446)).toBe(0);
  expect(Islamic.getDaysInMonth(13, 1446)).toBe(0);
  expect(Islamic.getDaysInMonth(1, 1342)).toBe(0);
  expect(Islamic.getDaysInMonth(1, 1501)).toBe(0);

  expect(new Islamic("not a date").getParts()).toEqual(["-", "-", "-"]);
  expect(new Islamic("not a date").format()).toBe("-");
  expect(Number.isNaN(new Islamic("not a date").unixDays())).toBe(true);
});

test("formats Hijri tokens", () => {
  const calendar = new Islamic({ year: 1446, month: 9, day: 1 });
  const dayOfYear =
    Array.from({ length: 8 }, (_, index) => Islamic.getDaysInMonth(index + 1, 1446))
      .reduce((total, length) => total + length, 0) + 1;

  expect(calendar.format()).toBe("1446/09/01");
  expect(calendar.format("iD iMMMM iYYYY")).toBe("1 رمضان 1446");
  expect(calendar.format("iDD-iMM-iYYYY")).toBe("01-09-1446");
  expect(calendar.format("iYY")).toBe("46");
  expect(calendar.format("iDDD")).toBe(String(dayOfYear).padStart(3, "0"));
  expect(calendar.unixDays()).toBe(20148);
});
