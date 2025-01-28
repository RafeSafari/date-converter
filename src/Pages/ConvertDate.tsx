import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Box, Typography, Button, Grid2 as Grid } from '@mui/material';
import Select from "components/Select";
import TextField from "components/TextField";
import toast from "react-hot-toast";
import CALENDARS from "calendars";

const ConvertDate = () => {

  const [sourceCalendar, setSourceCalendar] = useState(CALENDARS[0]);

  const [sourceDay, setSourceDay] = useState(1);
  const [sourceMonth, setSourceMonth] = useState(1);
  const [sourceYear, setSourceYear] = useState(1400);

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const confirmSelectedDate = () => {
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
        setSelectedDate(_calendar.date);
      }
    } catch (err) {
      console.error(err);
      toast.error("تاریخ انتخاب شده صحیح نیست");
    }
  }

  // reinit inputs on source calendar change
  useEffect(() => {
    const initialDate = new sourceCalendar.component(selectedDate);
    setSourceYear(initialDate.year());
    setSourceMonth(initialDate.month());
    setSourceDay(initialDate.day());
  }, [sourceCalendar]);

  const daysInMonth = useMemo(() => sourceCalendar.component.getDaysInMonth(sourceMonth, sourceYear), [sourceMonth, sourceYear]);

  useEffect(() => {
    if (daysInMonth < sourceDay) {
      setSourceDay(daysInMonth);
    }
  }, [daysInMonth]);

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
        <Box sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
        }}>
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
            onChange={(value) => {setSourceCalendar(value)}}
            sx={{ width: 180 }}
          />
        </Box>

        <Box sx={{
          width: '100%',
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
        }}>
          <Typography variant="h6" component="h6" gutterBottom sx={{whiteSpace: "nowrap"}}>
            تاریخ {sourceCalendar.title} را انتخاب کنید:
          </Typography>

          <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            width: { xs: '100%', sm: 'auto' },
            gap: 2,
          }}>
            <Grid container spacing={1} sx={{ width: { xs: '100%', sm: 'auto' } }}>
              <Grid size={3} minWidth={70}>
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
                  sx={{ width: "100%" }}
                />
              </Grid>

              <Grid size="grow" minWidth={100}>
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
                  sx={{ width: "100%" }}
                />
              </Grid>

              <Grid size={3} minWidth={70}>
                <TextField
                  label="سال"
                  type="number"
                  value={sourceYear}
                  onChange={(value) => {setSourceYear(Number(value))}}
                  sx={{ width: "100%" }}
                />
              </Grid>
            </Grid>

            <Button
              variant="contained"
              color="primary" 
              onClick={confirmSelectedDate}
              sx={{ width: { xs: '100%', sm: 'auto' }, whiteSpace: "nowrap" }}
            >
              محاسبه تاریخ های دیگر
            </Button>
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
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ConvertDate;
