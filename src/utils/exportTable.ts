import CALENDARS from "@/calendars";

export const MAX_EXPORT_DAYS = 1000;

export type ExportCell = string | number;

const DAY_MS = 86_400_000;

const pad = (value: number, length = 2): string => String(value).padStart(length, "0");

export const formatIsoDate = (date: Date): string =>
  `${pad(date.getFullYear(), 4)}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

export const countDaysInclusive = (start: Date, end: Date): number => {
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return NaN;
  }
  const startUtc = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
  const endUtc = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());
  return Math.round((endUtc - startUtc) / DAY_MS) + 1;
};

export const rangeDates = (start: Date, end: Date): Date[] => {
  const count = countDaysInclusive(start, end);
  if (!Number.isFinite(count) || count < 1) {
    return [];
  }
  return Array.from(
    { length: count },
    (_, index) => new Date(start.getFullYear(), start.getMonth(), start.getDate() + index),
  );
};

export const formatCalendarDate = (calendar: (typeof CALENDARS)[number], date: Date): string => {
  const value = new calendar.component(date);
  if (!value.isValid()) {
    return "-";
  }
  return `${value.year()}/${pad(value.month())}/${pad(value.day())}`;
};

export const buildExportTable = (
  start: Date,
  end: Date,
): { headers: string[]; rows: ExportCell[][] } => {
  const headers = ["ردیف", ...CALENDARS.map(calendar => calendar.title)];
  const rows = rangeDates(start, end).map((date, index) => [
    index + 1,
    ...CALENDARS.map(calendar => formatCalendarDate(calendar, date)),
  ]);
  return { headers, rows };
};

const escapeCsvCell = (cell: ExportCell): string => {
  const value = String(cell);
  return /[",\r\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
};

export const toCsv = (headers: string[], rows: ExportCell[][]): string =>
  "\uFEFF" +
  [headers, ...rows]
    .map(row => row.map(escapeCsvCell).join(","))
    .join("\r\n");
