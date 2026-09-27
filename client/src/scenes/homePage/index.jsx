import { Box, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import HomeActions from "../../features/home/components/HomeActions";
import Navbar from "../navbar";
import ProductsWidget from "../widgets/ProductsWidget";
import UserWidget from "../widgets/UserWidget";


const HomePage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const { _id, picturePath, role } = useSelector((state) => state.user);

  return (
    <Box>
      <Navbar />
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="5rem"
      >
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
          <UserWidget userId={_id} picturePath={picturePath} />
        </Box>
        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          <HomeActions role={role} />
          <ProductsWidget userId={_id} isProfile={role === "supplier"} />
        </Box>
      </Box>
    </Box>
  );
};

export default HomePage;