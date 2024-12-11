import React from "react";
import { Link } from "react-router-dom";
import { Box, Typography, Button } from '@mui/material';

const ConvertDate = () => {
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
        }}
      >
        <Typography variant="h4" component="h4" gutterBottom>
          تبدیل تاریخ
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          component={Link} 
          to="/diff" 
          sx={{ marginTop: 5 }}
        >
          محاسبه فاصله دو تاریخ
        </Button>
      </Box>
    </Box>
  );
};

export default ConvertDate;
