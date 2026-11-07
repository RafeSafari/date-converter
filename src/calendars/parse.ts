const EASTERN_ARABIC_DIGITS = "٠١٢٣٤٥٦٧٨٩";
const PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹";

export const normalizeDigits = (value: string): string =>
  value.replace(/[٠-٩۰-۹]/g, (digit) => {
    const eastern = EASTERN_ARABIC_DIGITS.indexOf(digit);
    return String(eastern >= 0 ? eastern : PERSIAN_DIGITS.indexOf(digit));
  });

export const parseNumericDate = (value: string): [number, number, number] | null => {
  const match = normalizeDigits(value)
    .trim()
    .match(/^(\d{1,4})[/\-.\s](\d{1,2})[/\-.\s](\d{1,2})$/);
  if (!match) {
    return null;
  }
  return [Number(match[1]), Number(match[2]), Number(match[3])];
};
