const DAY_MS = 86_400_000;

// Rata Die (RD): 1 = 0001-01-01 in the proleptic Gregorian calendar.
export const UNIX_EPOCH_RD = 719_163;

export const gregorianToRataDie = (year: number, month: number, day: number): number => {
  const date = new Date(0);
  date.setUTCHours(0, 0, 0, 0);
  date.setUTCFullYear(year, month - 1, day);
  return Math.floor(date.getTime() / DAY_MS) + UNIX_EPOCH_RD;
};

export const rataDieToGregorian = (
  rd: number,
): { year: number; month: number; day: number } | null => {
  if (!Number.isFinite(rd)) {
    return null;
  }
  const date = new Date((rd - UNIX_EPOCH_RD) * DAY_MS);
  if (isNaN(date.getTime())) {
    return null;
  }
  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate(),
  };
};

// Build a Date at local midnight so that getFullYear/getMonth/getDate always
// report the intended Gregorian day, regardless of the host timezone.
export const rataDieToLocalDate = (rd: number): Date => {
  const parts = rataDieToGregorian(rd);
  if (!parts) {
    return new Date(NaN);
  }
  const date = new Date(0);
  date.setHours(0, 0, 0, 0);
  date.setFullYear(parts.year, parts.month - 1, parts.day);
  return date;
};

export const dateToRataDie = (date: Date): number =>
  gregorianToRataDie(date.getFullYear(), date.getMonth() + 1, date.getDate());

export const dateToUnixDays = (date: Date): number => dateToRataDie(date) - UNIX_EPOCH_RD;
