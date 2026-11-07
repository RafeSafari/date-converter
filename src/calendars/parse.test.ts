import { normalizeDigits, parseNumericDate } from "./parse";

describe("date parsing", () => {
  it("normalizes Persian and Eastern Arabic digits", () => {
    expect(normalizeDigits("۰۱۲۳۴۵۶۷۸۹")).toBe("0123456789");
    expect(normalizeDigits("٠١٢٣٤٥٦٧٨٩")).toBe("0123456789");
    expect(normalizeDigits("abc 2025")).toBe("abc 2025");
  });

  const accepted: [string, [number, number, number]][] = [
    ["2025/11/07", [2025, 11, 7]],
    ["2025-11-07", [2025, 11, 7]],
    ["2025.11.07", [2025, 11, 7]],
    ["2025 11 07", [2025, 11, 7]],
    ["  2025/11/07  ", [2025, 11, 7]],
    ["1404/8/16", [1404, 8, 16]],
    ["1/2/3", [1, 2, 3]],
    ["۱۴۰۴/۰۸/۱۶", [1404, 8, 16]],
    ["١٤٤٧/٥/١٦", [1447, 5, 16]],
  ];

  it.each(accepted)("parses %p", (input, expected) => {
    expect(parseNumericDate(input)).toEqual(expected);
  });

  it.each([
    "",
    "2025/11",
    "2025/11/07/01",
    "20250/11/07",
    "abcd",
    "2025/11/07x",
    "2025,,07",
  ])("rejects %p", input => {
    expect(parseNumericDate(input)).toBeNull();
  });
});
