import PropTypes from 'prop-types';
import { Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const supplierButtonSx = {
  color: '#8c44d9',
  borderColor: '#8c44d9',
  fontSize: '1.25rem',
  padding: '12px 24px',
  '&:hover': {
    color: '#fff',
    backgroundColor: '#8c44d9',
    borderColor: '#8c44d9',
  },
};

function HomeActions({ role }) {
  if (role === 'supplier') {
    return (
      <Link to="/myproduct">
        <Button variant="outlined" size="large" sx={supplierButtonSx}>
          Add your product
        </Button>
      </Link>
    );
  }

  if (role === 'employee') {
    return (
      <Box display="flex" gap={5}>
        <Link to="/myproduct">
          <Button variant="outlined" size="large">
            Add product
          </Button>
        </Link>
        <Link to="/prediction">
          <Button variant="contained" size="large">
            Sales prediction
          </Button>
        </Link>
      </Box>
    );
  }

  return null;
}

HomeActions.propTypes = {
  role: PropTypes.string,
};

export default HomeActions;
