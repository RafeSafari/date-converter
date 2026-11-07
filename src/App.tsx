import React, { useState } from "react";
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { RTLProvider } from './theme/RTLProvider';
import { light as lightTheme, dark as darkTheme } from './theme/theme';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import DarkMode from "@mui/icons-material/DarkMode";
import LightMode from "@mui/icons-material/LightMode";
import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material';

// Routes
import Error404 from "./pages/404";
import Test from "./pages/Test";
import ConvertDate from "./pages/ConvertDate";
import DateDiffCalculator from "./pages/DateDiffCalculator";
import ExportRange from "./pages/ExportRange";
import { TOOLS } from "./components/ToolLinks";

const PAGE_TITLES: Record<string, string> = {
  "/test": "تست",
};

type ShellProps = {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
};

const Shell = ({ isDarkMode, onToggleDarkMode }: ShellProps) => {
  const location = useLocation();
  const path = location.pathname.toLowerCase();
  const tool = TOOLS.find(item => item.to.toLowerCase() === path);
  const pageTitle = tool?.label ?? PAGE_TITLES[path] ?? "تبدیل تاریخ";

  return (
    <>
      {/* #region Header */}
      <AppBar position="static" color="primary">
        <Toolbar>
          <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center", gap: 1 }}>
            {tool ? <tool.Icon /> : null}
            <Typography variant="h6" component="div">
              {pageTitle}
            </Typography>
          </Box>
          <IconButton color="inherit" onClick={onToggleDarkMode} aria-label="Toggle dark mode">
            {isDarkMode ? <LightMode titleAccess="روشن" /> : <DarkMode titleAccess="تیره" />}
          </IconButton>
        </Toolbar>
      </AppBar>
      {/* #endregion Header */}

      {/* #region Content */}
      <Box className="content">
        <Routes>
          <Route path="/Test" element={<Test />} />
          <Route path="/Conv" element={<ConvertDate />} />
          <Route path="/Diff" element={<DateDiffCalculator />} />
          <Route path="/Export" element={<ExportRange />} />
          <Route path="/" element={<Navigate to="/Conv" replace />} />
          <Route path="*" element={<Error404 />} />
        </Routes>
      </Box>
      {/* #endregion Content */}
    </>
  );
};

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

  return (
    <RTLProvider>
      <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
        <CssBaseline />
        <BrowserRouter>
          <Shell isDarkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} />
        </BrowserRouter>
        <Toaster position="bottom-right" containerStyle={{ direction: 'rtl' }} reverseOrder={false} />
      </ThemeProvider>
    </RTLProvider>
  );
}

export default App;
