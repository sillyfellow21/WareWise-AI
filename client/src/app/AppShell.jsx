import { BrowserRouter } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import PropTypes from 'prop-types';
import { AppRouter } from './router';
import PageTransition from './PageTransition';

export function AppShell({ theme }) {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <PageTransition>
          <AppRouter />
        </PageTransition>
      </ThemeProvider>
    </BrowserRouter>
  );
}

AppShell.propTypes = {
  theme: PropTypes.object.isRequired,
};
