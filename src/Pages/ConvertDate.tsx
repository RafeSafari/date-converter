import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Box, Typography, Button } from '@mui/material';
import Jalali from "calendars/Jalali";
import Gregorian from "calendars/Gregorian";
import { ChevronLeft } from "@mui/icons-material";
import Select from "components/Select";
import TextField from "components/TextField";

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
            variant="contained" 
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
            تاریخ جلالی (شمسی) را انتخاب کنید
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
            {/* </>} */}
            
            {/* Gregorian inputs */}
            {/* {sourceCalendar.name === "Gregorian" && <>
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
                sx={{ width: 80 }}
              />

              <TextField
                label="سال"
                type="number"
                value={sourceYear}
                onChange={(value) => {setSourceYear(Number(value))}}
                sx={{ width: 100 }}
              />
            </>} */}
          </Box>


        </Box>

      </Box>
    </Box>
  );
};

export default ConvertDate;
