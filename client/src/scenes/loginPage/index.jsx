import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import Form from "./Form";

const LoginPage = () => {
  const theme = useTheme();
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const alt = theme.palette.background.alt;
  const divider = theme.palette.divider;

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: theme.palette.background.default }}>
      {/* wordmark bar */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "0.6rem",
          px: "6%",
          py: "1.1rem",
          backgroundColor: alt,
          borderBottom: `1px solid ${divider}`,
        }}
      >
        <Typography
          fontWeight="bold"
          fontSize="1.15rem"
          letterSpacing="0.14em"
          textTransform="uppercase"
          color="primary"
          sx={{ display: "flex", alignItems: "center", gap: "0.6rem" }}
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
      </Box>

      {/* sign-in card */}
      <Box
        className="ww-stagger"
        sx={{
          width: isNonMobileScreens ? "46%" : "93%",
          p: isNonMobileScreens ? "2.5rem" : "1.5rem",
          m: "3rem auto",
          borderRadius: "10px",
          border: `1px solid ${divider}`,
          backgroundColor: alt,
          boxShadow:
            theme.palette.mode === "dark" ? "none" : "0 10px 28px rgba(33,37,43,0.06)",
        }}
      >
        <Typography variant="overline" color="primary">
          sign in
        </Typography>
        <Typography fontWeight="500" variant="h5" sx={{ mb: "1.5rem" }}>
          Welcome back
        </Typography>
        <Form />
      </Box>
    </Box>
  );
};

export default LoginPage;
