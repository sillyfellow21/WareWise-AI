import { BrowserRouter } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import PropTypes from "prop-types";
import { AppRouter } from "./router";

export function AppShell({ theme }) {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppRouter />
      </ThemeProvider>
    </BrowserRouter>
  );
}

AppShell.propTypes = {
  theme: PropTypes.object.isRequired,
};
