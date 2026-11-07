import CALENDARS from "calendars";

type CalendarInfo = (typeof CALENDARS)[number];

export interface DateParts {
  year: number;
  month: number;
  day: number;
}

export interface DatePartsSetters {
  setYear: (year: number) => void;
  setMonth: (month: number) => void;
  setDay: (day: number) => void;
}

const monthValues = (calendar: CalendarInfo): number[] =>
  calendar.component.getMonths().map(month => month.value);

const shiftMonth = (
  calendar: CalendarInfo,
  year: number,
  month: number,
  direction: 1 | -1,
): { year: number; month: number } | null => {
  const months = monthValues(calendar);
  const index = months.indexOf(month);
  if (index === -1) {
    return null;
  }

  const nextIndex = index + direction;
  if (nextIndex >= 0 && nextIndex < months.length) {
    return { year, month: months[nextIndex] };
  }

  return {
    year: year + direction,
    month: direction > 0 ? months[0] : months[months.length - 1],
  };
};

export const stepDayBoundary = (
  calendar: CalendarInfo,
  parts: DateParts,
  direction: 1 | -1,
): DateParts | null => {
  const shifted = shiftMonth(calendar, parts.year, parts.month, direction);
  if (!shifted) {
    return null;
  }

  if (direction > 0) {
    return { ...shifted, day: 1 };
  }

  const day = calendar.component.getDaysInMonth(shifted.month, shifted.year);
  return day > 0 ? { ...shifted, day } : null;
};

export const stepMonthBoundary = (
  calendar: CalendarInfo,
  parts: Pick<DateParts, "year" | "month">,
  direction: 1 | -1,
): Pick<DateParts, "year" | "month"> | null =>
  shiftMonth(calendar, parts.year, parts.month, direction);

export const createDateWheelHandlers = (
  calendar: CalendarInfo,
  parts: DateParts,
  setters: DatePartsSetters,
) => ({
  onDayBoundary: (direction: 1 | -1) => {
    const next = stepDayBoundary(calendar, parts, direction);
    if (!next) {
      return;
    }
    setters.setYear(next.year);
    setters.setMonth(next.month);
    setters.setDay(next.day);
  },
  onMonthBoundary: (direction: 1 | -1) => {
    const next = stepMonthBoundary(calendar, parts, direction);
    if (!next) {
      return;
    }
    setters.setYear(next.year);
    setters.setMonth(next.month);
  },
});
