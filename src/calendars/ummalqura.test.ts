import {
  HIJRI_MAX_YEAR,
  HIJRI_MIN_YEAR,
  MONTH_STARTS,
  dateToUnixDays,
  gregorianToRjd,
  hijriMonthLength,
  hijriToRjd,
  isValidHijriDate,
  rjdToGregorian,
  rjdToHijri,
  rjdToLocalDate,
} from "./ummalqura";

const YEAR_COUNT = HIJRI_MAX_YEAR - HIJRI_MIN_YEAR + 1;

test("Umm al-Qura table covers 1343-1500 AH with contiguous 29/30-day months", () => {
  expect(MONTH_STARTS).toHaveLength(YEAR_COUNT * 12 + 1);

  for (let index = 0; index < MONTH_STARTS.length - 1; index += 1) {
    const length = MONTH_STARTS[index + 1] - MONTH_STARTS[index];
    expect([29, 30]).toContain(length);
  }
});

test("every Hijri year has 354 or 355 days", () => {
  for (let year = HIJRI_MIN_YEAR; year <= HIJRI_MAX_YEAR; year += 1) {
    let yearLength = 0;
    for (let month = 1; month <= 12; month += 1) {
      yearLength += hijriMonthLength(year, month);
    }
    expect([354, 355]).toContain(yearLength);
  }
});

test("month starts and month ends round-trip", () => {
  for (let year = HIJRI_MIN_YEAR; year <= HIJRI_MAX_YEAR; year += 1) {
    for (let month = 1; month <= 12; month += 1) {
      const length = hijriMonthLength(year, month);
      expect(rjdToHijri(hijriToRjd({ year, month, day: 1 })!)).toEqual({ year, month, day: 1 });
      expect(rjdToHijri(hijriToRjd({ year, month, day: length })!)).toEqual({ year, month, day: length });
      expect(isValidHijriDate({ year, month, day: length + 1 })).toBe(false);
    }
  }
});

test("supported Gregorian boundaries", () => {
  const firstRjd = gregorianToRjd(1924, 8, 2);
  const lastRjd = gregorianToRjd(2077, 11, 16);

  expect(firstRjd).toBe(MONTH_STARTS[0]);
  expect(lastRjd).toBe(MONTH_STARTS[MONTH_STARTS.length - 1] - 1);
  expect(rjdToHijri(firstRjd)).toEqual({ year: 1343, month: 1, day: 1 });
  expect(rjdToHijri(lastRjd)).toEqual({ year: 1500, month: 12, day: 30 });
  expect(rjdToHijri(firstRjd - 1)).toBeNull();
  expect(rjdToHijri(lastRjd + 1)).toBeNull();
});

test("Gregorian conversion round-trips", () => {
  const samples: [number, number, number][] = [
    [1924, 8, 2],
    [1937, 3, 14],
    [1970, 1, 1],
    [2000, 2, 29],
    [2025, 3, 1],
    [2077, 11, 16],
  ];

  for (const [year, month, day] of samples) {
    expect(rjdToGregorian(gregorianToRjd(year, month, day))).toEqual({ year, month, day });
  }
});

test("RJD to local Date preserves the calendar date in every timezone", () => {
  const samples: [number, number, number][] = [
    [1924, 8, 2],
    [1970, 1, 1],
    [2025, 3, 1],
    [2077, 11, 16],
  ];

  for (const [year, month, day] of samples) {
    const date = rjdToLocalDate(gregorianToRjd(year, month, day));
    expect([date.getFullYear(), date.getMonth() + 1, date.getDate()]).toEqual([year, month, day]);
  }
});

test("dateToUnixDays is based on the local calendar date", () => {
  expect(dateToUnixDays(new Date(1970, 0, 1))).toBe(0);
  expect(dateToUnixDays(new Date(1969, 11, 31))).toBe(-1);
  expect(dateToUnixDays(new Date(2025, 2, 1))).toBe(20148);
});
