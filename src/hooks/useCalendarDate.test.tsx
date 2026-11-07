import { act, renderHook } from "@testing-library/react";
import CALENDARS from "calendars";
import Jalali from "calendars/Jalali";
import { useCalendarDate } from "./useCalendarDate";

const partsOf = (date: Date): [number, number, number] => {
  const jalali = new Jalali(date);
  return [jalali.year(), jalali.month(), jalali.day()];
};

const calendarByName = (name: string) => {
  const calendar = CALENDARS.find(item => item.name === name);
  if (!calendar) {
    throw new Error(`Unknown calendar: ${name}`);
  }
  return calendar;
};

describe("useCalendarDate", () => {
  it("starts from the current date in the default calendar", () => {
    const { result } = renderHook(() => useCalendarDate(new Date(2025, 10, 7)));

    expect(result.current.calendar.name).toBe("Jalali");
    expect([result.current.year, result.current.month, result.current.day]).toEqual([1404, 8, 16]);
    expect(result.current.daysInMonth).toBe(30);
    expect(partsOf(result.current.date)).toEqual([1404, 8, 16]);
  });

  it("recomputes the date when the parts change", () => {
    const { result } = renderHook(() => useCalendarDate(new Date(2025, 10, 7)));

    act(() => result.current.setMonth(9));
    expect(partsOf(result.current.date)).toEqual([1404, 9, 16]);

    act(() => result.current.setYear(1403));
    expect(partsOf(result.current.date)).toEqual([1403, 9, 16]);

    act(() => result.current.setDay(1));
    expect(partsOf(result.current.date)).toEqual([1403, 9, 1]);
  });

  it("clamps the day when the new month is shorter", () => {
    const { result } = renderHook(() => useCalendarDate(new Date(2025, 10, 7)));

    act(() => result.current.setDay(30));
    act(() => result.current.setMonth(12));

    expect(result.current.daysInMonth).toBe(29);
    expect(result.current.day).toBe(29);
    expect(partsOf(result.current.date)).toEqual([1404, 12, 29]);
  });

  it("keeps the same instant when switching calendars", () => {
    const { result } = renderHook(() => useCalendarDate(new Date(2025, 10, 7)));

    act(() => result.current.changeCalendar(calendarByName("Gregorian")));
    expect([result.current.year, result.current.month, result.current.day]).toEqual([2025, 11, 7]);
    expect(result.current.date.getTime()).toBe(new Date(2025, 10, 7).getTime());

    act(() => result.current.changeCalendar(calendarByName("Islamic")));
    expect([result.current.year, result.current.month, result.current.day]).toEqual([1447, 5, 16]);
  });

  it("reports an invalid date when the parts cannot form one", () => {
    const { result } = renderHook(() => useCalendarDate(new Date(2025, 10, 7)));

    act(() => result.current.setYear(1404.5));

    expect(Number.isNaN(result.current.date.getTime())).toBe(true);
    expect(result.current.daysInMonth).toBe(0);
  });
});
