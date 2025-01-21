import { createTheme } from '@mui/material/styles';

// Common theme settings
const common = {
  direction: 'rtl' as const, // Use 'as const' for TypeScript type inference
  typography: {
    fontFamily: 'IranSans, Arial, sans-serif',
  },
};

// Light theme
export const light = createTheme({
  ...common,
  palette: {
    mode: 'light',
    primary: {
      main: '#666cff', // Main primary color
      light: '#666cff1f', // Light variant
      dark: '#666cff0d', // Dark variant
    },
    background: {
      default: '#fff', // Default background color
      paper: '#f3f4f4', // Paper background color
    },
    text: {
      primary: '#516377', // Primary text color
      secondary: '#000', // Secondary text color (optional)
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        html, body {
          direction: rtl;
        }
      `,
    },
    MuiTypography: {
      styleOverrides: {
        body2: {
          backgroundColor: "#666cff22",
          color: "#516377",
          fontSize: "125%",
          fontWeight: 500,
          padding: ".25rem .5rem",
          borderRadius: ".25rem",
        },
      },
    },
  },
});

// Dark theme
export const dark = createTheme({
  ...common,
  palette: {
    mode: 'dark',
    primary: {
      main: '#666cff', // Main primary color
      light: '#666cff3b', // Light variant
      dark: '#666cff17', // Dark variant
    },
    background: {
      default: '#232a3b', // Default background color
      paper: '#283144', // Paper background color
    },
    text: {
      primary: '#d8deea', // Primary text color
      secondary: '#fff', // Secondary text color (optional)
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        html, body {
          direction: rtl;
        }
      `,
    },
    MuiTypography: {
      styleOverrides: {
        body2: {
          backgroundColor: "#232a3b",
          color: "white",
          fontSize: "120%",
          fontWeight: 500,
          padding: ".25rem .5rem",
          borderRadius: ".25rem",
        },
      },
    },
  },
});
