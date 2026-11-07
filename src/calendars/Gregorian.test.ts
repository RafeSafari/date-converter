import Gregorian from "./Gregorian";

const ISO_DAY_MS = 86_400_000;

describe("Gregorian calendar", () => {
  it("treats array input as 1-based like object input", () => {
    expect(new Gregorian([2025, 3, 1]).format("YYYY/MM/DD")).toBe("2025/03/01");
    expect(new Gregorian({ year: 2025, month: 3, day: 1 }).format("YYYY/MM/DD")).toBe("2025/03/01");
  });

  it("converts month lengths including leap years", () => {
    expect(Gregorian.getDaysInMonth(2, 2024)).toBe(29);
    expect(Gregorian.getDaysInMonth(2, 2023)).toBe(28);
    expect(Gregorian.getDaysInMonth(2, 1900)).toBe(28);
    expect(Gregorian.getDaysInMonth(2, 2000)).toBe(29);
    expect(Gregorian.getDaysInMonth(1, 2025)).toBe(31);
    expect(Gregorian.getDaysInMonth(4, 2025)).toBe(30);
  });

  it("returns zero for invalid months", () => {
    expect(Gregorian.getDaysInMonth(0, 2025)).toBe(0);
    expect(Gregorian.getDaysInMonth(13, 2025)).toBe(0);
    expect(Gregorian.getDaysInMonth(1.5, 2025)).toBe(0);
    expect(Gregorian.getDaysInMonth(1, 2025.5)).toBe(0);
  });

  it("keeps local calendar components", () => {
    const calendar = new Gregorian(new Date(2025, 10, 7));
    expect([calendar.year(), calendar.month(), calendar.day()]).toEqual([2025, 11, 7]);
  });

  it("counts unix days from the epoch", () => {
    expect(new Gregorian(new Date(1970, 0, 1)).unixDays()).toBe(0);
    expect(new Gregorian(new Date(1969, 11, 31)).unixDays()).toBe(-1);
    expect(new Gregorian(new Date(2025, 2, 1)).unixDays()).toBe(Math.floor(Date.UTC(2025, 2, 1) / ISO_DAY_MS));
  });

  it("formats deterministically regardless of the global moment locale", () => {
    expect(new Gregorian({ year: 2025, month: 3, day: 1 }).format("MMMM")).toBe("March");
    expect(new Gregorian({ year: 2025, month: 3, day: 1 }).getParts()).toEqual(["2025", "March", "1"]);
  });

  it("round-trips every day of the last 100 years", () => {
    const start = Date.UTC(1925, 0, 1);
    const end = Date.UTC(2025, 11, 31);
    let mismatches = 0;
    let checked = 0;

    for (let time = start; time <= end; time += ISO_DAY_MS) {
      const utc = new Date(time);
      const calendar = new Gregorian({ year: utc.getUTCFullYear(), month: utc.getUTCMonth() + 1, day: utc.getUTCDate() });
      const back = calendar.valueOf();
      if (
        back.getFullYear() !== utc.getUTCFullYear() ||
        back.getMonth() !== utc.getUTCMonth() ||
        back.getDate() !== utc.getUTCDate()
      ) {
        mismatches++;
      }
      checked++;
    }

    expect(checked).toBeGreaterThan(36_000);
    expect(mismatches).toBe(0);
  });

  it("reports invalid dates safely", () => {
    const invalid = new Gregorian(new Date(NaN));
    expect(invalid.isValid()).toBe(false);
    expect(Number.isNaN(invalid.unixDays())).toBe(true);
  });
});
