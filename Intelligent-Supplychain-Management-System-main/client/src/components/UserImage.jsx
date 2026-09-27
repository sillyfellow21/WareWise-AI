import { Box } from "@mui/material";
import { buildApiUrl } from "../config";

const UserImage = ({ image, size = "60px" }) => {
  const imageSrc = image ? buildApiUrl(`/assets/${image}`) : "";

  return (
    <Box width={size} height={size}>
      <img
        style={{ objectFit: "cover", borderRadius: "50%" }}
        width={size}
        height={size}
        alt="user"
        src={imageSrc}
      />
    </Box>
  );
};

export default UserImage;