import { useMemo, useState, type MouseEvent } from "react";
import {
  Box,
  Typography,
  Button,
  ButtonGroup,
  Menu,
  MenuItem,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import DateFields from "components/DateFields";
import ToolLinks from "components/ToolLinks";
import toast from "react-hot-toast";
import { useCalendarDate } from "hooks/useCalendarDate";
import {
  MAX_EXPORT_DAYS,
  buildExportTable,
  countDaysInclusive,
  formatIsoDate,
  toCsv,
} from "utils/exportTable";
import { thousandSep } from "utils";
import { createDateWheelHandlers } from "utils/dateSteps";

type ExportFormat = "xlsx" | "csv";

const FORMAT_LABELS: Record<ExportFormat, string> = {
  xlsx: "اکسل",
  csv: "CSV",
};

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
  const start = useCalendarDate(new Date());
  const end = useCalendarDate(new Date(Date.now() + 30 * 86_400_000));

  const [format, setFormat] = useState<ExportFormat>("xlsx");
  const [isExporting, setIsExporting] = useState(false);
  const [formatMenuAnchor, setFormatMenuAnchor] = useState<HTMLElement | null>(null);

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

  const exportLabel = rangeError
    ? `دریافت ${FORMAT_LABELS[format]}`
    : `دریافت ${FORMAT_LABELS[format]} برای ${thousandSep(dayCount)} روز`;

  const exportRange = async (selectedFormat: ExportFormat = format) => {
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

      if (selectedFormat === "csv") {
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

  const openFormatMenu = (event: MouseEvent<HTMLElement>) => {
    setFormatMenuAnchor(event.currentTarget);
  };

  const exportWithFormat = (selectedFormat: ExportFormat) => {
    setFormatMenuAnchor(null);
    setFormat(selectedFormat);
    void exportRange(selectedFormat);
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
        <DateFields label="تاریخ شروع" value={start} />
        <DateFields label="تاریخ پایان" value={end} />

        {rangeError ? (
          <Typography variant="body1" color="error">
            {rangeError}
          </Typography>
        ) : null}

        <Box sx={{
          width: "100%",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
        }}>
          <ButtonGroup
            variant="contained"
            color="primary"
            disabled={!!rangeError || isExporting}
            aria-label="خروجی بازه تاریخ"
          >
            <Button
              onClick={() => { void exportRange(); }}
              sx={{ minWidth: 180, whiteSpace: "nowrap" }}
            >
              {isExporting ? "در حال آماده‌سازی..." : exportLabel}
            </Button>
            <Button
              size="small"
              aria-label="انتخاب قالب خروجی"
              aria-controls={formatMenuAnchor ? "export-format-menu" : undefined}
              aria-expanded={formatMenuAnchor ? "true" : undefined}
              aria-haspopup="menu"
              onClick={openFormatMenu}
            >
              <ArrowDropDownIcon />
            </Button>
          </ButtonGroup>
          <Menu
            id="export-format-menu"
            anchorEl={formatMenuAnchor}
            open={Boolean(formatMenuAnchor)}
            onClose={() => { setFormatMenuAnchor(null); }}
          >
            <MenuItem selected={format === "xlsx"} onClick={() => { exportWithFormat("xlsx"); }}>
              اکسل (xlsx)
            </MenuItem>
            <MenuItem selected={format === "csv"} onClick={() => { exportWithFormat("csv"); }}>
              CSV
            </MenuItem>
          </Menu>
        </Box>
      </Box>

      {/* other links */}
      <ToolLinks current="export" />
    </Box>
  );
};

export default ExportRange;
