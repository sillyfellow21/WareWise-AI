import { Box } from '@mui/material';
import { styled } from '@mui/system';

// A quiet card: white surface, hairline border, and a soft lift on hover.
const WidgetWrapper = styled(Box)(({ theme }) => ({
  padding: '1.5rem 1.5rem 0.75rem 1.5rem',
  backgroundColor: theme.palette.background.alt,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: '10px',
  boxShadow: theme.palette.mode === 'dark' ? 'none' : '0 1px 2px rgba(33,37,43,0.04)',
  transition:
    'transform 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 250ms ease, border-color 250ms ease',
  '&:hover': {
    transform: 'translateY(-3px)',
    borderColor: theme.palette.mode === 'dark' ? 'rgba(157,165,180,0.36)' : '#d8dfec',
    boxShadow: theme.palette.mode === 'dark' ? 'none' : '0 10px 28px rgba(33,37,43,0.08)',
  },
}));

export default WidgetWrapper;
