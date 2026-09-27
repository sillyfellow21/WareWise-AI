import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { createTheme } from '@mui/material/styles';
import { themeSettings } from './theme';
import { AppShell } from './app/AppShell';

function App() {
  const mode = useSelector((state) => state.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  return <AppShell theme={theme} />;
}

export default App;
