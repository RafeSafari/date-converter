import CALENDARS from "calendars";
import {
  createDateWheelHandlers,
  stepDayBoundary,
  stepMonthBoundary,
} from "./dateSteps";

const calendar = (name: string) => {
  const found = CALENDARS.find(item => item.name === name);
  if (!found) {
    throw new Error(`Unknown calendar: ${name}`);
  }
  return found;
};

const jalali = calendar("Jalali");
const badi = calendar("Badi");
const islamic = calendar("Islamic");
const chinese = calendar("Chinese");

describe("stepDayBoundary", () => {
  it("moves from the last day of a month to the first day of the next", () => {
    expect(stepDayBoundary(jalali, { year: 1404, month: 8, day: 30 }, 1)).toEqual({
      year: 1404,
      month: 9,
      day: 1,
    });
    expect(stepDayBoundary(islamic, { year: 1446, month: 9, day: 29 }, 1)).toEqual({
      year: 1446,
      month: 10,
      day: 1,
    });
  });

  it("rolls into the next year after the last month", () => {
    expect(stepDayBoundary(jalali, { year: 1404, month: 12, day: 29 }, 1)).toEqual({
      year: 1405,
      month: 1,
      day: 1,
    });
  });

  it("moves from the first day to the last day of the previous month", () => {
    expect(stepDayBoundary(jalali, { year: 1404, month: 1, day: 1 }, -1)).toEqual({
      year: 1403,
      month: 12,
      day: 30,
    });
    expect(stepDayBoundary(islamic, { year: 1446, month: 10, day: 1 }, -1)).toEqual({
      year: 1446,
      month: 9,
      day: 29,
    });
  });

  it("follows the Badi month order around Ayyam-i-Ha", () => {
    expect(stepDayBoundary(badi, { year: 181, month: 20, day: 4 }, 1)).toEqual({
      year: 181,
      month: 19,
      day: 1,
    });
    expect(stepDayBoundary(badi, { year: 181, month: 19, day: 19 }, 1)).toEqual({
      year: 182,
      month: 1,
      day: 1,
    });
    expect(stepDayBoundary(badi, { year: 181, month: 1, day: 1 }, -1)).toEqual({
      year: 180,
      month: 19,
      day: 19,
    });
  });

  it("returns null for an unknown month", () => {
    expect(stepDayBoundary(jalali, { year: 1404, month: 13, day: 1 }, 1)).toBeNull();
  });

  it("follows the Chinese month order around a leap month", () => {
    expect(stepDayBoundary(chinese, { year: 2025, month: 6, day: 30 }, 1)).toEqual({
      year: 2025,
      month: 18,
      day: 1,
    });
    expect(stepDayBoundary(chinese, { year: 2025, month: 18, day: 29 }, 1)).toEqual({
      year: 2025,
      month: 7,
      day: 1,
    });
    expect(stepDayBoundary(chinese, { year: 2025, month: 7, day: 1 }, -1)).toEqual({
      year: 2025,
      month: 18,
      day: 29,
    });
  });
});

describe("stepMonthBoundary", () => {
  it("increments the year after the last month", () => {
    expect(stepMonthBoundary(jalali, { year: 1404, month: 12 }, 1)).toEqual({ year: 1405, month: 1 });
    expect(stepMonthBoundary(islamic, { year: 1447, month: 12 }, 1)).toEqual({ year: 1448, month: 1 });
    expect(stepMonthBoundary(badi, { year: 181, month: 19 }, 1)).toEqual({ year: 182, month: 1 });
  });

  it("decrements the year before the first month", () => {
    expect(stepMonthBoundary(jalali, { year: 1404, month: 1 }, -1)).toEqual({ year: 1403, month: 12 });
    expect(stepMonthBoundary(badi, { year: 181, month: 1 }, -1)).toEqual({ year: 180, month: 19 });
  });

  it("returns null for an unknown month", () => {
    expect(stepMonthBoundary(jalali, { year: 1404, month: 13 }, 1)).toBeNull();
  });

  it("steps over the leap month and into the next year's month list", () => {
    expect(stepMonthBoundary(chinese, { year: 2025, month: 18 }, 1)).toEqual({ year: 2025, month: 7 });
    expect(stepMonthBoundary(chinese, { year: 2025, month: 18 }, -1)).toEqual({ year: 2025, month: 6 });
    expect(stepMonthBoundary(chinese, { year: 2025, month: 12 }, 1)).toEqual({ year: 2026, month: 1 });

    // The target year's month list decides what the boundary month is.
    expect(stepMonthBoundary(chinese, { year: 2026, month: 1 }, -1)).toEqual({ year: 2025, month: 12 });
  });
});

describe("createDateWheelHandlers", () => {
  it("writes the wrapped day, month and year together", () => {
    const setters = { setYear: jest.fn(), setMonth: jest.fn(), setDay: jest.fn() };
    const handlers = createDateWheelHandlers(
      jalali,
      { year: 1404, month: 8, day: 30 },
      setters,
    );

    handlers.onDayBoundary(1);

    expect(setters.setYear).toHaveBeenCalledWith(1404);
    expect(setters.setMonth).toHaveBeenCalledWith(9);
    expect(setters.setDay).toHaveBeenCalledWith(1);
  });

  it("writes the wrapped month and year without touching the day", () => {
    const setters = { setYear: jest.fn(), setMonth: jest.fn(), setDay: jest.fn() };
    const handlers = createDateWheelHandlers(
      jalali,
      { year: 1404, month: 12, day: 16 },
      setters,
    );

    handlers.onMonthBoundary(1);

    expect(setters.setYear).toHaveBeenCalledWith(1405);
    expect(setters.setMonth).toHaveBeenCalledWith(1);
    expect(setters.setDay).not.toHaveBeenCalled();
  });

  it("does nothing when the month is unknown", () => {
    const setters = { setYear: jest.fn(), setMonth: jest.fn(), setDay: jest.fn() };
    const handlers = createDateWheelHandlers(
      jalali,
      { year: 1404, month: 13, day: 1 },
      setters,
    );

    handlers.onDayBoundary(1);
    handlers.onMonthBoundary(1);

    expect(setters.setYear).not.toHaveBeenCalled();
    expect(setters.setMonth).not.toHaveBeenCalled();
    expect(setters.setDay).not.toHaveBeenCalled();
  });
});
