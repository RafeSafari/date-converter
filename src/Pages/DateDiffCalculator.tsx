import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Box, Typography, Button, Grid2 as Grid } from "@mui/material";
import Select from "components/Select";
import TextField from "components/TextField";
import toast from "react-hot-toast";
import CALENDARS from "calendars";
import moment from "moment";
import { thousandSep } from "utils";

const DateDiffCalculator = () => {
  const [sourceCalendar, setSourceCalendar] = useState(CALENDARS[0]);
  const [sourceDay, setSourceDay] = useState(1);
  const [sourceMonth, setSourceMonth] = useState(1);
  const [sourceYear, setSourceYear] = useState(1400);
  const [sourceDate, setSourceDate] = useState<Date>(new Date());

  const [targetCalendar, setTargetCalendar] = useState(CALENDARS[1]);
  const [targetDay, setTargetDay] = useState(1);
  const [targetMonth, setTargetMonth] = useState(1);
  const [targetYear, setTargetYear] = useState(2000);
  const [targetDate, setTargetDate] = useState<Date>(new Date(Date.now() + 7 * 86_400_000)); // next week

  const confirmSelectedDates = () => {
    try {
      const _calendar = new sourceCalendar.component({ year: sourceYear, month: sourceMonth, day: sourceDay });
      if (!_calendar.date) {
        throw new Error("Invalid date");
      } else if (_calendar.day() !== sourceDay) {
        throw new Error("Invalid Day");
      } else if (_calendar.month() !== sourceMonth) {
        throw new Error("Invalid Month");
      } else if (_calendar.year() !== sourceYear) {
        throw new Error("Invalid Year");
      } else {
        setSourceDate(_calendar.date);
      }
    } catch (err) {
      console.error(err);
      toast.error("تاریخ مبدأ انتخاب شده صحیح نیست");
      return;
    }

    try {
      const _calendar = new targetCalendar.component({ year: targetYear, month: targetMonth, day: targetDay });
      if (!_calendar.date) {
        throw new Error("Invalid date");
      } else if (_calendar.day() !== targetDay) {
        throw new Error("Invalid Day");
      } else if (_calendar.month() !== targetMonth) {
        throw new Error("Invalid Month");
      } else if (_calendar.year() !== targetYear) {
        throw new Error("Invalid Year");
      } else {
        setTargetDate(_calendar.date);
      }
    } catch (err) {
      console.error(err);
      toast.error("تاریخ مقصد انتخاب شده صحیح نیست");
      return;
    }
  };

  // reinit inputs on source calendar change
  useEffect(() => {
    const initialDate = new sourceCalendar.component(sourceDate);
    setSourceYear(initialDate.year());
    setSourceMonth(initialDate.month());
    setSourceDay(initialDate.day());
  }, [sourceCalendar]);

  // reinit inputs on target calendar change
  useEffect(() => {
    const initialDate = new targetCalendar.component(targetDate);
    setTargetYear(initialDate.year());
    setTargetMonth(initialDate.month());
    setTargetDay(initialDate.day());
  }, [targetCalendar]);

  const diffDays = useMemo<number>(() => {
    return moment(sourceDate).diff(targetDate, "days");
  }, [targetDate, sourceDate]);

  const sourceDaysInMonth = useMemo(() => sourceCalendar.component.getDaysInMonth(sourceMonth, sourceYear), [sourceMonth, sourceYear]);
  useEffect(() => {
    if (sourceDaysInMonth < sourceDay) {
      setSourceDay(sourceDaysInMonth);
    }
  }, [sourceDaysInMonth]);

  const targetDaysInMonth = useMemo(() => targetCalendar.component.getDaysInMonth(targetMonth, targetYear), [targetMonth, targetYear]);
  useEffect(() => {
    if (targetDaysInMonth < targetDay) {
      setSourceDay(targetDaysInMonth);
    }
  }, [targetDaysInMonth]);

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
      <title>محاسبه فاصله دو تاریخ</title>

      {/* input box */}
      <Box
        sx={{
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
        }}
      >
        {/* source date */}
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Select
            label="تاریخ مبدأ"
            options={CALENDARS.map((calendar) => ({
              title: (
                <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "0.25rem", direction: "ltr" }}>
                  <Typography>{calendar.title}</Typography>
                  {calendar.title_alt ? <Typography variant="caption">({calendar.title_alt})</Typography> : ""}
                </Box>
              ),
              value: calendar,
            }))}
            value={sourceCalendar}
            onChange={(value) => {
              setSourceCalendar(value);
            }}
            sx={{ width: 180 }}
          />

          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              flexWrap: "wrap",
              width: { xs: "100%", sm: "auto" },
              gap: 2,
            }}
          >
            <Grid container spacing={1} sx={{ width: { xs: "100%", sm: "auto" } }}>
              <Grid size={3} minWidth={70}>
                <Select
                  label="روز"
                  options={Array.from({ length: sourceDaysInMonth }, (_, index) => ({
                    title: `${index + 1}`,
                    value: index + 1,
                  }))}
                  value={sourceDay}
                  onChange={(value) => {
                    setSourceDay(value);
                  }}
                  sx={{ width: "100%" }}
                />
              </Grid>

              <Grid size="grow" minWidth={100}>
                <Select
                  label="ماه"
                  options={sourceCalendar.component.getMonths().map((month) => ({
                    title: month.name,
                    value: month.value,
                  }))}
                  value={sourceMonth}
                  onChange={(value) => {
                    setSourceMonth(value);
                  }}
                  sx={{ width: "100%" }}
                />
              </Grid>

              <Grid size={3} minWidth={70}>
                <TextField
                  label="سال"
                  type="number"
                  value={sourceYear}
                  onChange={(value) => {
                    setSourceYear(Number(value));
                  }}
                  sx={{ width: "100%" }}
                />
              </Grid>
            </Grid>
          </Box>
        </Box>

        {/* target date */}
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Select
            label="تاریخ مقصد"
            options={CALENDARS.map((calendar) => ({
              title: (
                <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "0.25rem", direction: "ltr" }}>
                  <Typography>{calendar.title}</Typography>
                  {calendar.title_alt ? <Typography variant="caption">({calendar.title_alt})</Typography> : ""}
                </Box>
              ),
              value: calendar,
            }))}
            value={targetCalendar}
            onChange={(value) => {
              setTargetCalendar(value);
            }}
            sx={{ width: 180 }}
          />

          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              flexWrap: "wrap",
              width: { xs: "100%", sm: "auto" },
              gap: 2,
            }}
          >
            <Grid container spacing={1} sx={{ width: { xs: "100%", sm: "auto" } }}>
              <Grid size={3} minWidth={70}>
                <Select
                  label="روز"
                  options={Array.from({ length: targetDaysInMonth }, (_, index) => ({
                    title: `${index + 1}`,
                    value: index + 1,
                  }))}
                  value={targetDay}
                  onChange={(value) => {
                    setTargetDay(value);
                  }}
                  sx={{ width: "100%" }}
                />
              </Grid>

              <Grid size="grow" minWidth={100}>
                <Select
                  label="ماه"
                  options={targetCalendar.component.getMonths().map((month) => ({
                    title: month.name,
                    value: month.value,
                  }))}
                  value={targetMonth}
                  onChange={(value) => {
                    setTargetMonth(value);
                  }}
                  sx={{ width: "100%" }}
                />
              </Grid>

              <Grid size={3} minWidth={70}>
                <TextField
                  label="سال"
                  type="number"
                  value={targetYear}
                  onChange={(value) => {
                    setTargetYear(Number(value));
                  }}
                  sx={{ width: "100%" }}
                />
              </Grid>
            </Grid>
          </Box>
        </Box>


        <Button variant="contained" color="primary" onClick={confirmSelectedDates} sx={{ width: { xs: "100%", sm: "auto" }, whiteSpace: "nowrap" }}>
          محاسبه فاصله
        </Button>
      </Box>

      {/* result box */}
      <Box
        sx={{
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
        }}
      >
        {/* Results */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
          }}
        >
          <Box key={sourceCalendar.name} sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: ".35rem" }}>
            {/* <Typography variant="h6">
              {sourceCalendar.title}
              {sourceCalendar.title_alt ? <Typography variant="caption"> ({sourceCalendar.title_alt})</Typography> : ""}:
            </Typography> */}
            {!new sourceCalendar.component(sourceDate).isValid() || !new sourceCalendar.component(sourceDate).isValid() ? (
              <Typography variant="h6">
                <Typography variant="caption" color="warning">
                  غیر قابل محاسبه!
                </Typography>
              </Typography>
            ) : <>
              {(
                new sourceCalendar.component(sourceDate)
                .getParts()
                .reverse()
                .map((part, i) => (
                  <Typography key={i}>
                    {part}
                  </Typography>
                ))
              )}
              <Typography variant="caption">(مبدأ)</Typography>
              {diffDays === 0 ?
                <>
                  <Typography variant="body2">برابر</Typography>
                  <Typography>با</Typography>
                </>
                :
                <>
                  <Typography variant="body2">{`${thousandSep(Math.abs(diffDays))} روز ${diffDays < 0 ? "قبل" : "بعد"}`}</Typography>
                  <Typography>از</Typography>
                </>
              }
              {(
                new targetCalendar.component(targetDate)
                .getParts()
                .reverse()
                .map((part, i) => (
                  <Typography key={i}>
                    {part}
                  </Typography>
                ))
              )}
              <Typography variant="caption">(مقصد)</Typography>
              <Typography>است</Typography>
            </>}
          </Box>
        </Box>
      </Box>

      {/* other links */}
      <Box
        sx={{
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
        }}
      >
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              flexWrap: "wrap",
              width: "100%",
              gap: 1,
            }}
          >
            <Typography variant="h6" component="h6" width="100%">
              دیگر ابزار ها
            </Typography>
            <Button variant="text" color="primary" component={Link} to="/conv" sx={{ paddingInlineEnd: 1 }}>
              تبدیل تاریخ
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default DateDiffCalculator;
