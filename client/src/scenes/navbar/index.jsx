import { useState } from "react";
import {
  Box,
  IconButton,
  InputBase,
  Typography,
  Select,
  MenuItem,
  FormControl,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Search,
  Message,
  DarkMode,
  LightMode,
  Notifications,
  Help,
  Menu,
  Close,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { setMode, setLogout } from "../../state";
import { useNavigate } from "react-router-dom";
import FlexBetween from "../../components/FlexBetween";

const Navbar = () => {
  const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const Role = useSelector((state)=> state.user.role);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const primaryLight = theme.palette.primary.light;
  const alt = theme.palette.background.alt;
  const divider = theme.palette.divider;

  const iconStyle = {
    color: theme.palette.neutral.medium,
    fontSize: "25px",
    transition: "color 200ms ease, transform 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    "&:hover": { color: theme.palette.primary.main, transform: "translateY(-1px)" },
  };

  const userSelect = {
    backgroundColor: neutralLight,
    width: "150px",
    borderRadius: "7px",
    p: "0.3rem 1rem",
    "& .MuiSvgIcon-root": { pr: "0.25rem", width: "2.5rem" },
    "& .MuiSelect-select:focus": { backgroundColor: neutralLight },
  };

  const fullName = `${user.firstName} ${user.lastName}`;

  return (
    <FlexBetween
      padding="0.9rem 6%"
      backgroundColor={alt}
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        borderBottom: `1px solid ${divider}`,
      }}
    >
      <FlexBetween gap="1.5rem">
        <FlexBetween gap="0.6rem">
          <Typography
            fontWeight="bold"
            fontSize="1.15rem"
            letterSpacing="0.14em"
            textTransform="uppercase"
            color={Role === "employee" ? "primary" : "secondary"}
            onClick={() => navigate("/home")}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              "&:hover": {
                color: primaryLight,
                cursor: "pointer",
              },
            }}
          >
            <span className="ww-live-dot" aria-hidden="true" />
            WareWise
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              border: `1px solid ${divider}`,
              borderRadius: "999px",
              padding: "1px 8px",
            }}
          >
            demo
          </Typography>
        </FlexBetween>
        {isNonMobileScreens && (
          <FlexBetween
            gap="1rem"
            sx={{
              backgroundColor: background,
              border: `1px solid ${divider}`,
              borderRadius: "7px",
              padding: "0.35rem 0.5rem 0.35rem 1rem",
              transition: "border-color 200ms ease",
              "&:focus-within": { borderColor: theme.palette.primary.main },
            }}
          >
            <InputBase placeholder="Search..." sx={{ fontSize: "0.9rem" }} />
            <IconButton size="small" sx={{ color: theme.palette.neutral.medium }}>
              <Search fontSize="small" />
            </IconButton>
          </FlexBetween>
        )}
      </FlexBetween>

      {/* DESKTOP NAV */}
      {isNonMobileScreens ? (
        <FlexBetween gap="1.25rem">
          <IconButton onClick={() => dispatch(setMode())}>
            {theme.palette.mode === "dark" ? (
              <DarkMode sx={iconStyle} />
            ) : (
              <LightMode sx={{ ...iconStyle, color: dark }} />
            )}
          </IconButton>
          <Message sx={iconStyle} />
          <Notifications sx={iconStyle} />
          <Help sx={iconStyle} />
          <FormControl variant="standard" value={fullName}>
            <Select value={fullName} sx={userSelect} input={<InputBase />}>
              <MenuItem value={fullName}>
                <Typography>{fullName}</Typography>
              </MenuItem>
              <MenuItem onClick={() => dispatch(setLogout()) && navigate("/")}>Log Out</MenuItem>
            </Select>
          </FormControl>
        </FlexBetween>
      ) : (
        <IconButton onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}>
          <Menu />
        </IconButton>
      )}

      {/* MOBILE NAV */}
      {!isNonMobileScreens && isMobileMenuToggled && (
        <Box
          position="fixed"
          right="0"
          bottom="0"
          height="100%"
          zIndex="10"
          maxWidth="500px"
          minWidth="300px"
          backgroundColor={background}
        >
          {/* CLOSE ICON */}
          <Box display="flex" justifyContent="flex-end" p="1rem">
            <IconButton onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}>
              <Close />
            </IconButton>
          </Box>

          {/* MENU ITEMS */}
          <FlexBetween
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            gap="3rem"
          >
            <IconButton onClick={() => dispatch(setMode())} sx={{ fontSize: "25px" }}>
              {theme.palette.mode === "dark" ? (
                <DarkMode sx={{ fontSize: "25px" }} />
              ) : (
                <LightMode sx={{ color: dark, fontSize: "25px" }} />
              )}
            </IconButton>
            <Message sx={iconStyle} />
            <Notifications sx={iconStyle} />
            <Help sx={iconStyle} />
            <FormControl variant="standard" value={fullName}>
              <Select value={fullName} sx={userSelect} input={<InputBase />}>
                <MenuItem value={fullName}>
                  <Typography>{fullName}</Typography>
                </MenuItem>
                <MenuItem onClick={() => dispatch(setLogout()) && navigate("/")}>Log Out</MenuItem>
              </Select>
            </FormControl>
          </FlexBetween>
        </Box>
      )}
    </FlexBetween>
  );
};

export default Navbar;

