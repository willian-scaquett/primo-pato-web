import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#00E0B7",
      light: "#4AFFE8",
      dark: "#00B894",
    },
    secondary: {
      main: "#1A2C2C", 
      light: "#2A3C3C",
      dark: "#0A1C1C",
    },
    background: {
      default: "#0A1C1C",
      paper: "#1A2C2C", 
    },
    text: {
      primary: "#FFFFFF",
      secondary: "#B0B0B0",
    },
    success: {
      main: "#00E0B7",
    },
    warning: {
      main: "#FF6B6B",
    },
    error: {
      main: "#FF4757",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: "2.5rem",
      fontWeight: 700,
      color: "#FFFFFF",
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 600,
      color: "#FFFFFF",
    },
    h3: {
      fontSize: "1.5rem",
      fontWeight: 600,
      color: "#FFFFFF",
    },
    h4: {
      fontSize: "1.25rem",
      fontWeight: 600,
      color: "#FFFFFF",
    },
    h5: {
      fontSize: "1.125rem",
      fontWeight: 600,
      color: "#FFFFFF",
    },
    h6: {
      fontSize: "1rem",
      fontWeight: 600,
      color: "#FFFFFF",
    },
    body1: {
      fontSize: "1rem",
      color: "#FFFFFF",
    },
    body2: {
      fontSize: "0.875rem",
      color: "#B0B0B0",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          textTransform: "none",
          fontWeight: 600,
        },
        contained: {
          backgroundColor: "#00E0B7",
          color: "#FFFFFF",
          "&:hover": {
            backgroundColor: "#00B894",
          },
        },
        outlined: {
          borderColor: "#00E0B7",
          color: "#00E0B7",
          "&:hover": {
            borderColor: "#00B894",
            backgroundColor: "rgba(0, 224, 183, 0.1)",
          },
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        inputRoot: {
          "&.MuiOutlinedInput-root": {
            "& fieldset": { borderColor: "#00E0B7" },
            "&:hover fieldset": { borderColor: "#4AFFE8" },
            "&.Mui-focused fieldset": { borderColor: "#00E0B7" },
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            backgroundColor: "#1A2C2C",
            borderRadius: "8px",
            "& fieldset": { borderColor: "#00E0B7" },
            "&:hover fieldset": { borderColor: "#4AFFE8" },
            "&.Mui-focused fieldset": { borderColor: "#00E0B7" },
            "&.Mui-disabled fieldset": { borderColor: "#4AFFE8" },
          },
          "& .MuiInputLabel-root": {
            color: "#B0B0B0",
            "&.Mui-focused": { color: "#00E0B7" },
            "&.Mui-disabled": { color: "#777777" },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "#1A2C2C",
          border: "1px solid #00E0B7",
          borderRadius: "12px",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "#1A2C2C",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#0A1C1C",
          borderBottom: "1px solid #00E0B7",
        },
      },
    },
  },
});

export { theme };
