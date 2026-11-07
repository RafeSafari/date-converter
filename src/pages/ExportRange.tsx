import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Box, Typography, Button, useMediaQuery } from "@mui/material";
import Select from "components/Select";
import TextField from "components/TextField";
import toast from "react-hot-toast";
import CALENDARS from "calendars";
import { useCalendarDate } from "hooks/useCalendarDate";
import {
  MAX_EXPORT_DAYS,
  buildExportTable,
  countDaysInclusive,
  formatIsoDate,
  toCsv,
} from "utils/exportTable";
import { thousandSep } from "utils";

type CalendarDate = ReturnType<typeof useCalendarDate>;

const CALENDAR_OPTIONS = CALENDARS.map(calendar => ({
  title: (
    <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "0.25rem", direction: "ltr" }}>
      <Typography>{calendar.title}</Typography>
      {calendar.title_alt ? <Typography variant="caption">({calendar.title_alt})</Typography> : ""}
    </Box>
  ),
  value: calendar,
}));

const FORMAT_OPTIONS = [
  { title: "اکسل (xlsx)", value: "xlsx" },
  { title: "CSV", value: "csv" },
];

const downloadBlob = (blob: Blob, fileName: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

const DateFields = ({
  label,
  value,
  stackInputs,
}: {
  label: string;
  value: CalendarDate;
  stackInputs: boolean;
}) => {
  const { calendar, changeCalendar, day, setDay, month, setMonth, year, setYear, daysInMonth } = value;

  return (
    <Box sx={{ width: "100%", display: "flex", flexWrap: "wrap", gap: 1, alignItems: "center" }}>
      <Box sx={{ flex: { xs: "1 1 100%", sm: "0 0 180px" } }}>
        <Select
          label={label}
          options={CALENDAR_OPTIONS}
          value={calendar}
          onChange={(next) => { changeCalendar(next); }}
          sx={{ width: "100%" }}
        />
      </Box>

      <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 0" }, display: "flex", flexWrap: "wrap", gap: 1 }}>
        <Box sx={{ flex: stackInputs ? "1 1 100%" : "1 1 0", minWidth: stackInputs ? 0 : 70 }}>
          <Select
            label="روز"
            options={
              Array.from({ length: daysInMonth }, (_, index) => ({
                title: `${index + 1}`,
                value: index + 1,
              }))
            }
            value={day}
            onChange={(next) => { setDay(next); }}
            sx={{ width: "100%" }}
          />
        </Box>

        <Box sx={{ flex: stackInputs ? "1 1 100%" : "2 1 0", minWidth: stackInputs ? 0 : 100 }}>
          <Select
            label="ماه"
            options={
              calendar.component.getMonths().map(item => ({
                title: item.name,
                value: item.value,
              }))
            }
            value={month}
            onChange={(next) => { setMonth(next); }}
            sx={{ width: "100%" }}
          />
        </Box>

        <Box sx={{ flex: stackInputs ? "1 1 100%" : "1 1 0", minWidth: stackInputs ? 0 : 70 }}>
          <TextField
            label="سال"
            type="number"
            value={year}
            onChange={(next) => { setYear(Number(next)); }}
            sx={{ width: "100%" }}
          />
        </Box>
      </Box>
    </Box>
  );
};

const cardSx = {
  backgroundColor: "background.paper",
  borderRadius: 2,
  textAlign: "center",
  padding: { xs: 2, sm: 4 },
  width: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: 2,
  maxWidth: 1000,
};

const ExportRange = () => {
  const stackInputs = useMediaQuery("(max-width: 319.98px)");
  const start = useCalendarDate(new Date());
  const end = useCalendarDate(new Date(Date.now() + 30 * 86_400_000));

  const [format, setFormat] = useState<"xlsx" | "csv">("xlsx");
  const [isExporting, setIsExporting] = useState(false);

  const dayCount = useMemo(
    () => countDaysInclusive(start.date, end.date),
    [start.date, end.date],
  );

  const rangeError = useMemo(() => {
    if (isNaN(dayCount)) {
      return "تاریخ شروع و پایان باید معتبر باشند";
    }
    if (dayCount < 1) {
      return "تاریخ پایان باید بعد از تاریخ شروع باشد";
    }
    if (dayCount > MAX_EXPORT_DAYS) {
      return `حداکثر بازه خروجی ${thousandSep(MAX_EXPORT_DAYS)} روز است`;
    }
    return "";
  }, [dayCount]);

  const exportRange = async () => {
    if (rangeError) {
      toast.error(rangeError);
      return;
    }

    setIsExporting(true);
    try {
      // let the loading state render before generating the file
      await new Promise(resolve => setTimeout(resolve, 0));

      const { headers, rows } = buildExportTable(start.date, end.date);
      const fileName = `dates-${formatIsoDate(start.date)}-to-${formatIsoDate(end.date)}`;

      if (format === "csv") {
        const blob = new Blob([toCsv(headers, rows)], { type: "text/csv;charset=utf-8" });
        downloadBlob(blob, `${fileName}.csv`);
      } else {
        const XLSX = await import("xlsx");
        const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
        worksheet["!cols"] = headers.map((_, index) => ({ wch: index === 0 ? 6 : 16 }));
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Dates");
        const data = XLSX.write(workbook, { bookType: "xlsx", type: "array" }) as ArrayBuffer;
        const blob = new Blob([data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        downloadBlob(blob, `${fileName}.xlsx`);
      }

      toast.success("فایل خروجی آماده شد");
    } catch (error) {
      console.error(error);
      toast.error("ساخت فایل خروجی ناموفق بود");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Box
      sx={{
        padding: { xs: 2, sm: 4 },
        display: "flex",
        flexDirection: "column",
        gap: { xs: 2, sm: 4 },
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <title>خروجی بازه تاریخ</title>

      {/* input box */}
      <Box sx={cardSx}>
        <DateFields label="تاریخ شروع" value={start} stackInputs={stackInputs} />
        <DateFields label="تاریخ پایان" value={end} stackInputs={stackInputs} />

        <Typography variant="body1" color={rangeError ? "error" : "text.secondary"}>
          {rangeError || `${thousandSep(dayCount)} روز`}
        </Typography>

        <Box sx={{
          width: "100%",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
        }}>
          <Select
            label="قالب فایل"
            options={FORMAT_OPTIONS}
            value={format}
            onChange={(next) => { setFormat(next); }}
            sx={{ width: 180 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={exportRange}
            disabled={!!rangeError || isExporting}
            sx={{ minWidth: 180, whiteSpace: "nowrap" }}
          >
            {isExporting ? "در حال آماده‌سازی..." : "دریافت فایل"}
          </Button>
        </Box>
      </Box>

      {/* other links */}
      <Box sx={cardSx}>
        <Box sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          flexWrap: "wrap",
          width: "100%",
          gap: 1,
        }}>
          <Typography variant="h6" component="h6" width="100%">دیگر ابزار ها</Typography>
          <Button variant="text" color="primary" component={Link} to="/Conv" sx={{ paddingInlineEnd: 1 }}>
            تبدیل تاریخ
          </Button>
          <Button variant="text" color="primary" component={Link} to="/Diff" sx={{ paddingInlineEnd: 1 }}>
            محاسبه فاصله دو تاریخ
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ExportRange;
