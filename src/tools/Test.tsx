"use client";

import { Box, Typography, Button } from '@mui/material';
import toast from "react-hot-toast";
import solstice from "astronomia/solstice";
import julian from "astronomia/julian";

const Test = () => {

  const startTest = () => {
    try {
      
      console.log(julian.JDToDate(solstice.march(1820)))
      console.log(julian.JDToDate(solstice.march(1840)))
      console.log(julian.JDToDate(solstice.march(1860)))
      console.log(julian.JDToDate(solstice.march(1880)))
      console.log(julian.JDToDate(solstice.march(1900)))
      console.log(julian.JDToDate(solstice.march(1920)))
      console.log(julian.JDToDate(solstice.march(1940)))
      console.log(julian.JDToDate(solstice.march(1960)))
      console.log(julian.JDToDate(solstice.march(1980)))
      console.log(julian.JDToDate(solstice.march(2000)))
      console.log(julian.JDToDate(solstice.march(2020)))
      console.log(julian.JDToDate(solstice.march(2040)))
      console.log(julian.JDToDate(solstice.march(2060)))
      console.log(julian.JDToDate(solstice.march(2080)))
      console.log(julian.JDToDate(solstice.march(2100)))
    } catch (err) {
      console.error(err);
      toast.error("در زمان اجرای تست خطایی رخ داده");
    }
  }

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
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
        }}>
          <Typography variant="h6" component="h6" gutterBottom sx={{whiteSpace: "nowrap"}}>
            تست
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
            <Button
              variant="contained"
              color="primary" 
              onClick={startTest}
              sx={{ width: { xs: '100%', sm: 'auto' }, whiteSpace: "nowrap" }}
            >
              شروع تست
            </Button>
          </Box>
        </Box>
      
      </Box>
    </Box>
  );
};

export default Test;
