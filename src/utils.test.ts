import { isEqualObjects, thousandSep } from "./utils";

describe("isEqualObjects", () => {
  it("compares primitives strictly", () => {
    expect(isEqualObjects(1, 1)).toBe(true);
    expect(isEqualObjects("a", "a")).toBe(true);
    expect(isEqualObjects(1, "1")).toBe(false);
    expect(isEqualObjects(null, null)).toBe(true);
    expect(isEqualObjects(null, {})).toBe(false);
    expect(isEqualObjects(undefined, undefined)).toBe(true);
  });

  it("compares nested objects regardless of key order", () => {
    expect(isEqualObjects({ a: 1, b: 2 }, { b: 2, a: 1 })).toBe(true);
    expect(isEqualObjects({ a: { b: [1, 2] } }, { a: { b: [1, 2] } })).toBe(true);
  });

  it("detects different values, missing keys and extra keys", () => {
    expect(isEqualObjects({ a: { b: 1 } }, { a: { b: 2 } })).toBe(false);
    expect(isEqualObjects({ a: 1 }, { a: 1, b: 2 })).toBe(false);
    expect(isEqualObjects({ a: 1, b: 2 }, { a: 1, c: 2 })).toBe(false);
  });
});

describe("thousandSep", () => {
  it("groups digits with commas", () => {
    expect(thousandSep(0)).toBe("0");
    expect(thousandSep(999)).toBe("999");
    expect(thousandSep(1000)).toBe("1,000");
    expect(thousandSep(1234567)).toBe("1,234,567");
    expect(thousandSep(-1234567)).toBe("-1,234,567");
  });

  it("returns an empty string for missing or invalid numbers", () => {
    expect(thousandSep(NaN)).toBe("");
    expect(thousandSep(null as unknown as number)).toBe("");
    expect(thousandSep(undefined as unknown as number)).toBe("");
  });
});
