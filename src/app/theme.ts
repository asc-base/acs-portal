import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#120554",
    },
    secondary: {
      main: "#dc004e",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          marginBottom: "16px",
          "& .MuiOutlinedInput-root": {
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "var(--color-primary03)",
              borderWidth: 3,
            },
            "&:hover:not(.Mui-focused) .MuiOutlinedInput-notchedOutline": {
              borderColor: "var(--color-primary04)",
              borderWidth: 1,
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "var(--color-neutral03)",
              borderWidth: 1,
            },
            "&.Mui-error .MuiOutlinedInput-notchedOutline": {
              borderColor: "var(--color-accent04)",
              borderWidth: 1,
            },
          },
        },
      },
    },
  },
});

export default theme;
