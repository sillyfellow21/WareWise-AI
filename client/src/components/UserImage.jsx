import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import { apiUrl } from '../config/api';

const UserImage = ({ image, size = '60px' }) => {
  return (
    <Box width={size} height={size}>
      <img
        style={{ objectFit: 'cover', borderRadius: '50%' }}
        width={size}
        height={size}
        alt="user"
        src={`${apiUrl('/assets')}/${image}`}
      />
    </Box>
  );
};

export default UserImage;

UserImage.propTypes = {
  image: PropTypes.string.isRequired,
  size: PropTypes.string,
};
