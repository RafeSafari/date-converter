import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Box, Typography, Button, useMediaQuery } from '@mui/material';
import Select from "components/Select";
import TextField from "components/TextField";
import CALENDARS from "calendars";
import { createDateWheelHandlers } from "utils/dateSteps";

const ConvertDate = () => {

  const stackInputs = useMediaQuery('(max-width: 319.98px)');

  const [sourceCalendar, setSourceCalendar] = useState(CALENDARS[0]);

  const [sourceDay, setSourceDay] = useState(() => new CALENDARS[0].component(new Date()).day());
  const [sourceMonth, setSourceMonth] = useState(() => new CALENDARS[0].component(new Date()).month());
  const [sourceYear, setSourceYear] = useState(() => new CALENDARS[0].component(new Date()).year());

  const selectedDate = useMemo(() => {
    const calendar = new sourceCalendar.component({ year: sourceYear, month: sourceMonth, day: sourceDay });
    return calendar.isValid() &&
      calendar.day() === sourceDay &&
      calendar.month() === sourceMonth &&
      calendar.year() === sourceYear
      ? calendar.date
      : new Date(NaN);
  }, [sourceCalendar, sourceYear, sourceMonth, sourceDay]);

  const changeSourceCalendar = (calendar: (typeof CALENDARS)[number]) => {
    const converted = new calendar.component(selectedDate);
    setSourceCalendar(calendar);
    if (converted.isValid()) {
      setSourceYear(converted.year());
      setSourceMonth(converted.month());
      setSourceDay(converted.day());
    }
  };

  const daysInMonth = useMemo(
    () => sourceCalendar.component.getDaysInMonth(sourceMonth, sourceYear),
    [sourceCalendar, sourceMonth, sourceYear],
  );

  useEffect(() => {
    if (daysInMonth > 0 && daysInMonth < sourceDay) {
      setSourceDay(daysInMonth);
    }
  }, [daysInMonth, sourceDay]);

  const wheelHandlers = createDateWheelHandlers(
    sourceCalendar,
    { year: sourceYear, month: sourceMonth, day: sourceDay },
    { setYear: setSourceYear, setMonth: setSourceMonth, setDay: setSourceDay },
  );

  return (
    <Box
      sx={{
        padding: { xs: 2, sm: 4 },
        display: 'flex',
        flexDirection: "column",
        gap: { xs: 2, sm: 4 },
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <title>تبدیل تاریخ</title>

      {/* input box */}
      <Box
        sx={{
          backgroundColor: 'background.paper',
          borderRadius: 2,
          textAlign: 'center', 
          padding: { xs: 2, sm: 4 },
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          maxWidth: 1000,
        }}
      >
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, width: '100%' }}>
          <Box sx={{ flex: { xs: '1 1 100%', sm: '0 0 180px' } }}>
            <Select
              label="تقویم منبع"
              options={
                CALENDARS.map(calendar => ({
                  title: <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "0.25rem", direction: "ltr" }}>
                    <Typography>{calendar.title}</Typography>
                    {calendar.title_alt ? <Typography variant="caption">({calendar.title_alt})</Typography> : ''}
                  </Box>,
                  value: calendar,
                }))
              }
              value={sourceCalendar}
              onChange={(value) => {changeSourceCalendar(value)}}
              sx={{ width: "100%" }}
            />
          </Box>

          <Box sx={{
            flex: { xs: '1 1 100%', sm: '1 1 0' },
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1,
          }}>
            <Box sx={{ flex: stackInputs ? '1 1 100%' : '1 1 0', minWidth: stackInputs ? 0 : 70 }}>
              <Select
                label="روز"
                options={
                  Array.from({ length: daysInMonth }, (_, index) => ({
                    title: `${index + 1}`,
                    value: index + 1,
                  }))
                }
                value={sourceDay}
                onChange={(value) => {setSourceDay(value)}}
                onStepBeyond={wheelHandlers.onDayBoundary}
                sx={{ width: "100%" }}
              />
            </Box>

            <Box sx={{ flex: stackInputs ? '1 1 100%' : '2 1 0', minWidth: stackInputs ? 0 : 100 }}>
              <Select
                label="ماه"
                options={
                  sourceCalendar.component.getMonths().map(month => ({
                    title: month.name,
                    value: month.value,
                  }))
                }
                value={sourceMonth}
                onChange={(value) => {setSourceMonth(value)}}
                onStepBeyond={wheelHandlers.onMonthBoundary}
                sx={{ width: "100%" }}
              />
            </Box>

            <Box sx={{ flex: stackInputs ? '1 1 100%' : '1 1 0', minWidth: stackInputs ? 0 : 70 }}>
              <TextField
                label="سال"
                type="number"
                value={sourceYear}
                onChange={(value) => {setSourceYear(Number(value))}}
                sx={{ width: "100%" }}
              />
            </Box>
          </Box>
        </Box>
      </Box>
      
      {/* result box */}
      <Box
        sx={{
          backgroundColor: 'background.paper',
          borderRadius: 2,
          textAlign: 'center', 
          padding: { xs: 2, sm: 4 },
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          maxWidth: 1000,
        }}
      >
        {/* Results */}
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
        }}>
          {CALENDARS.filter(calendar => calendar.name !== sourceCalendar.name).map(calendar => (
            <Box key={calendar.name} sx={{display: "flex", flexDirection: "row", gap: 1}}>
              <Typography variant="h6">
                {calendar.title}{calendar.title_alt ? <Typography variant="caption"> ({calendar.title_alt})</Typography>: ''}:
              </Typography>
              {new calendar.component(selectedDate).isValid() ?
                new calendar.component(selectedDate).getParts().reverse().map((part, i) => (
                  <Typography key={i} variant="h6">{part}</Typography>
                ))
              :
              <Typography variant="h6">
                <Typography variant="caption" color="warning">غیر قابل محاسبه!</Typography>
              </Typography>
              }
            </Box>
          ))}
        </Box>
      </Box>
      
      {/* other links */}
      <Box
        sx={{
          backgroundColor: 'background.paper',
          borderRadius: 2,
          textAlign: 'center', 
          padding: { xs: 2, sm: 4 },
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          maxWidth: 1000,
        }}
      >
        <Box sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
        }}>
          <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            flexWrap: "wrap",
            width: '100%',
            gap: 1,
          }}>
            <Typography variant="h6" component="h6" width="100%">دیگر ابزار ها</Typography>
            <Button 
              variant="text" 
              color="primary" 
              component={Link} 
              to="/diff"
              sx={{paddingInlineEnd: 1}}
            >
              محاسبه فاصله دو تاریخ
            </Button>
            <Button
              variant="text"
              color="primary"
              component={Link}
              to="/Export"
              sx={{ paddingInlineEnd: 1 }}
            >
              خروجی بازه تاریخ
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ConvertDate;
