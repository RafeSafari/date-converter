import React from "react";
import { Link } from "react-router-dom";
import { Box, Typography, Button } from '@mui/material';

const NotFound = () => {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: 3,
        height: '100vh', // Full height for centering
      }}
    >
      <Typography variant="h1" component="h1" gutterBottom>
        404
      </Typography>
      <Typography variant="body1" gutterBottom>
        صفحه مورد نظر پیدا نشد
      </Typography>
      <img
        alt="404"
        src="/img/404.png"
        width="480px"
        style={{ paddingTop: '16px' }} // Using inline styles for padding
      />
      <Button 
        variant="contained" 
        color="primary" 
        component={Link} 
        to="/" 
        sx={{ marginTop: 3 }} // Margin for spacing
      >
        برگشت به خانه
      </Button>
    </Box>
  );
}

export default NotFound;
