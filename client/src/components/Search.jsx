import PropTypes from 'prop-types';
import { TextField } from '@mui/material';

const Search = ({ value, onChange, placeholder }) => {
  const handleInputChange = (product) => {
    onChange(product.target.value);
  };

  return (
    <TextField label={placeholder} variant="outlined" value={value} onChange={handleInputChange} />
  );
};

export default Search;

Search.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};
