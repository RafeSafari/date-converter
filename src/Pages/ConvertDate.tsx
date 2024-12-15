import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Box, Typography, Button, Divider } from '@mui/material';
import Jalali from "calendars/Jalali";
import Gregorian from "calendars/Gregorian";
import { ChevronLeft } from "@mui/icons-material";
import Select from "components/Select";
import TextField from "components/TextField";
import toast from "react-hot-toast";

const calendars = [{
  name: "Jalali",
  title: "جلالی",
  title_alt: "شمسی",
  component: Jalali,
}, {
  name: "Gregorian",
  title: "میلادی",
  title_alt: null,
  component: Gregorian,
}]

const ConvertDate = () => {

  const [sourceCalendar, setSourceCalendar] = useState(calendars[0]);

  const [sourceDay, setSourceDay] = useState(1);
  const [sourceMonth, setSourceMonth] = useState(1);
  const [sourceYear, setSourceYear] = useState(1400);

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const confirmSelectedDate = () => {
    try {
      const _calendar = new sourceCalendar.component(`${sourceYear}-${sourceMonth}-${sourceDay}`);
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
    const initialDate = new sourceCalendar.component();
    setSourceDay(initialDate.day());
    setSourceMonth(initialDate.month());
    setSourceYear(initialDate.year());
  }, [sourceCalendar])

  const [daysInMonth, setDaysInMonth] = useState(31);
  useEffect(() => {
    setDaysInMonth(sourceCalendar.component.getDayInMonth(sourceMonth, sourceYear));
  }, [sourceMonth, sourceYear])

  useEffect(() => {
    if (daysInMonth < sourceDay) {
      setSourceDay(daysInMonth);
    }
  }, [daysInMonth])

  return (
    <Box 
      sx={{ 
        padding: 3, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
      }}
    >
      <title>تبدیل تاریخ</title>
      <Box 
        sx={{ 
          backgroundColor: 'background.paper',
          borderRadius: 2,
          textAlign: 'center', 
          padding: 4,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
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
          <Typography variant="h4" component="h4" gutterBottom>
            تبدیل تاریخ
          </Typography>

          <Button 
            variant="text" 
            color="primary" 
            component={Link} 
            to="/diff"
            sx={{paddingInlineEnd: 1}}
          >
            محاسبه فاصله دو تاریخ
            <ChevronLeft  />
          </Button>
        </Box>
        
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
              calendars.map(calendar => ({
                title: `${calendar.title}${calendar.title_alt ? ` - ${calendar.title_alt}` : ''}`,
                value: calendar,
              }))
            }
            value={sourceCalendar}
            onChange={(value) => {setSourceCalendar(value)}}
            sx={{ width: 160 }}
          />
        </Box>

        <Box sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
        }}>
          <Typography variant="h6" component="h6" gutterBottom>
            تاریخ {sourceCalendar.title} {sourceCalendar.title_alt && `(${sourceCalendar.title_alt})`} را انتخاب کنید:
          </Typography>

          <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
          }}>
            {/* Jalaali inputs */}
            {/* {sourceCalendar.name === "Jalali" && <> */}
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
                sx={{ width: 80 }}
              />

              <Select
                label="ماه"
                options={
                  sourceCalendar.component.getMonths().map((month, index) => ({
                    title: month,
                    value: index + 1,
                  }))
                }
                value={sourceMonth}
                onChange={(value) => {setSourceMonth(value)}}
                sx={{ width: 140 }}
              />

              <TextField
                label="سال"
                type="number"
                value={sourceYear}
                onChange={(value) => {setSourceYear(Number(value))}}
                sx={{ width: 100 }}
              />

              <Button 
                variant="contained" 
                color="primary" 
                onClick={confirmSelectedDate}
              >
                تبدیل
              </Button>
            {/* </>} */}
          </Box>
        </Box>

        <Divider sx={{ width: '100%', marginY: 1 }} />

        {/* Results */}
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
        }}>
          {calendars.filter(calendar => calendar.name !== sourceCalendar.name).map(calendar => (
            <Box key={calendar.name} sx={{display: "flex", flexDirection: "row", gap: 1}}>
              <Typography variant="h6">
                {calendar.title}{calendar.title_alt && ` (${calendar.title_alt})`}:
              </Typography>
              <Typography variant="h6">{new calendar.component(selectedDate).format("D")}</Typography>
              <Typography variant="h6">{new calendar.component(selectedDate).format("MMMM")}</Typography>
              <Typography variant="h6">{new calendar.component(selectedDate).format("YYYY")}</Typography>
            </Box>
          ))}
        </Box>

      </Box>
    </Box>
  );
};

export default ConvertDate;
