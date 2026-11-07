import { useEffect, useMemo, useState } from "react";
import CALENDARS from "calendars";

export type CalendarInfo = (typeof CALENDARS)[number];

export const useCalendarDate = (initialDate: Date, initialCalendar: CalendarInfo = CALENDARS[0]) => {
  const [calendar, setCalendar] = useState<CalendarInfo>(initialCalendar);
  const [day, setDay] = useState(() => new initialCalendar.component(initialDate).day());
  const [month, setMonth] = useState(() => new initialCalendar.component(initialDate).month());
  const [year, setYear] = useState(() => new initialCalendar.component(initialDate).year());

  const date = useMemo(() => {
    const value = new calendar.component({ year, month, day });
    return value.isValid() &&
      value.day() === day &&
      value.month() === month &&
      value.year() === year
      ? value.date
      : new Date(NaN);
  }, [calendar, day, month, year]);

  const changeCalendar = (next: CalendarInfo) => {
    const converted = new next.component(date);
    setCalendar(next);
    if (converted.isValid()) {
      setYear(converted.year());
      setMonth(converted.month());
      setDay(converted.day());
    }
  };

  const daysInMonth = useMemo(
    () => calendar.component.getDaysInMonth(month, year),
    [calendar, month, year],
  );

  useEffect(() => {
    if (daysInMonth > 0 && daysInMonth < day) {
      setDay(daysInMonth);
    }
  }, [daysInMonth, day]);

  return {
    calendar,
    changeCalendar,
    day,
    setDay,
    month,
    setMonth,
    year,
    setYear,
    date,
    daysInMonth,
  };
};

export type CalendarDate = ReturnType<typeof useCalendarDate>;
