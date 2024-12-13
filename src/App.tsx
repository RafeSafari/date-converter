import React, { useEffect, useState } from "react";
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { RTLProvider } from './theme/RTLProvider';
import { light as lightTheme, dark as darkTheme } from './theme/theme';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import { DarkMode, LightMode } from "@mui/icons-material";
import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material';

// Routes
import Error404 from "./pages/404";
import ConvertDate from "./pages/ConvertDate";
import DateDiffCalculator from "./pages/DateDiffCalculator";

function App() {
  // Initialize state based on localStorage
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const savedMode = localStorage.getItem("isDarkMode");
    return savedMode === 'true';
  });

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
    localStorage.setItem("isDarkMode", !isDarkMode ? 'true' : 'false');
  };

  const [pageTitle, setPageTitle] = useState<string>('تبدیل تاریخ');
  const RouteChangeHandler: React.FC = () => {
    const location = useLocation();

    useEffect(() => {
      setPageTitle(document.title);
    }, [location]);

    return null;
  };

  return (
    <RTLProvider>
      <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
        <CssBaseline />
        
        {/* #region Header */}
        <AppBar position="static" color="primary">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              {pageTitle}
            </Typography>
            <IconButton color="inherit" onClick={toggleDarkMode} aria-label="Toggle dark mode">
              {isDarkMode ? <LightMode titleAccess="روشن" /> : <DarkMode titleAccess="تیره" />}
            </IconButton>
          </Toolbar>
        </AppBar>
        {/* #endregion Header */}
        
        {/* #region Content */}
        <Box className="content">
          <BrowserRouter>
            <RouteChangeHandler />
            <Routes>
              <Route path="/Conv" element={<ConvertDate />} />
              <Route path="/Diff" element={<DateDiffCalculator />} />
              <Route path="/" element={<Navigate to="/Conv" replace />} />
              <Route path="*" element={<Error404 />} />
            </Routes>
          </BrowserRouter>
        </Box>
        {/* #endregion Content */}

        <Toaster position="bottom-right" containerStyle={{ direction: 'rtl' }} reverseOrder={false} />
      </ThemeProvider>
    </RTLProvider>
  );
}

export default App;
