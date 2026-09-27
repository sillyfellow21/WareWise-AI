import PropTypes from 'prop-types';
import { Pagination } from '@mui/material';
import { useMediaQuery } from '@mui/material';

const CustomPagination = ({ page, limit, total, setPage }) => {
  const pageCount = Math.ceil(total / limit);

  // Corrected the handleChange function
  const handleChange = (event, value) => {
    setPage(value);
  };

  const isNonMobileScreens = useMediaQuery('(min-width:1000px)');

  return (
    <Pagination
      size={isNonMobileScreens ? 'large' : 'small'}
      color="primary"
      count={pageCount}
      page={page}
      onChange={handleChange}
      variant="outlined"
      shape="rounded"
    />
  );
};

export default CustomPagination;

CustomPagination.propTypes = {
  page: PropTypes.number.isRequired,
  limit: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  setPage: PropTypes.func.isRequired,
};
