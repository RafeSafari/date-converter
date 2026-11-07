import {
  MAX_EXPORT_DAYS,
  buildExportTable,
  countDaysInclusive,
  formatIsoDate,
  rangeDates,
  toCsv,
} from "./exportTable";

const localDate = (iso: string) => new Date(`${iso}T00:00:00`);

describe("export range table", () => {
  it("counts days inclusively", () => {
    expect(countDaysInclusive(localDate("2025-11-07"), localDate("2025-11-07"))).toBe(1);
    expect(countDaysInclusive(localDate("2025-11-07"), localDate("2025-11-09"))).toBe(3);
    expect(countDaysInclusive(localDate("2025-11-09"), localDate("2025-11-07"))).toBe(-1);
    expect(countDaysInclusive(new Date(NaN), localDate("2025-11-07"))).toBeNaN();
    expect(rangeDates(localDate("2025-11-07"), localDate("2025-11-06"))).toEqual([]);
  });

  it("builds one row per day with every calendar", () => {
    const { headers, rows } = buildExportTable(localDate("2025-11-07"), localDate("2025-11-08"));

    expect(headers).toEqual(["ردیف", "شمسی", "میلادی", "بدیع", "هجری قمری", "چینی", "هندی", "عبری"]);
    expect(rows).toHaveLength(2);
    expect(rows[0]).toEqual([
      1, "1404/08/16", "2025/11/07", "182/13/05", "1447/05/16", "2025/09/18", "1947/08/16", "5786/02/16",
    ]);
    expect(rows[1]).toEqual([
      2, "1404/08/17", "2025/11/08", "182/13/06", "1447/05/17", "2025/09/19", "1947/08/17", "5786/02/17",
    ]);
  });

  it("exports exactly the maximum number of days", () => {
    const start = localDate("2025-01-01");
    const end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + MAX_EXPORT_DAYS - 1);
    const { rows } = buildExportTable(start, end);

    expect(countDaysInclusive(start, end)).toBe(MAX_EXPORT_DAYS);
    expect(rows).toHaveLength(MAX_EXPORT_DAYS);
    expect(rows[0][0]).toBe(1);
    expect(rows[MAX_EXPORT_DAYS - 1][0]).toBe(MAX_EXPORT_DAYS);
  });

  it("writes a UTF-8 BOM CSV with escaped cells", () => {
    const csv = toCsv(["a", "b"], [[1, "x,y"], [2, 'say "hi"']]);
    const plain = toCsv(["a", "b"], [[1, "x"]]);

    expect(csv.startsWith("\uFEFF")).toBe(true);
    expect(csv).toBe('\uFEFFa,b\r\n1,"x,y"\r\n2,"say ""hi"""');
    expect(plain).toBe("\uFEFFa,b\r\n1,x");
  });

  it("marks dates outside a calendar's supported range", () => {
    const { rows } = buildExportTable(localDate("1924-08-01"), localDate("1924-08-01"));
    const chinese = buildExportTable(localDate("2101-06-01"), localDate("2101-06-01"));

    expect(rows).toHaveLength(1);
    expect(rows[0][4]).toBe("-");
    expect(rows[0][5]).not.toBe("-");
    expect(chinese.rows[0][5]).toBe("-");
  });

  it("formats dates for file names", () => {
    expect(formatIsoDate(localDate("2025-11-07"))).toBe("2025-11-07");
    expect(formatIsoDate(localDate("0001-02-03"))).toBe("0001-02-03");
  });
});
