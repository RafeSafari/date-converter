import { Box, Typography, useMediaQuery } from "@mui/material";
import Select from "components/Select";
import TextField from "components/TextField";
import CALENDARS from "calendars";
import type { CalendarDate } from "hooks/useCalendarDate";
import { createDateWheelHandlers } from "utils/dateSteps";

const CALENDAR_OPTIONS = CALENDARS.map(calendar => ({
  title: (
    <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "0.25rem", direction: "ltr" }}>
      <Typography>{calendar.title}</Typography>
      {calendar.title_alt ? <Typography variant="caption">({calendar.title_alt})</Typography> : ""}
    </Box>
  ),
  value: calendar,
}));

interface DateFieldsProps {
  label: string;
  value: CalendarDate;
}

const DateFields = ({ label, value }: DateFieldsProps) => {
  const stackInputs = useMediaQuery("(max-width: 319.98px)");
  const { calendar, changeCalendar, day, setDay, month, setMonth, year, setYear, daysInMonth } = value;

  const wheelHandlers = createDateWheelHandlers(
    calendar,
    { year, month, day },
    { setYear, setMonth, setDay },
  );

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
            onStepBeyond={wheelHandlers.onDayBoundary}
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
            onStepBeyond={wheelHandlers.onMonthBoundary}
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

export default DateFields;
