// Colour design tokens for the WareWise UI.
//
// The look follows barba.js: a clean white canvas, one confident blue for
// actions and links, a small rainbow of vivid accents for status, crisp
// 4-10px radii, hairline borders and mono-spaced labels.

export const colorTokens = {
  ink: "#21252b",
  slate: "#282c34",
  muted: "#9da5b4",
  line: "#e6eaf2",
  surface: "#ffffff",
  canvas: "#f5f7fc",
  primary: {
    50: "#eef2fe",
    100: "#dbe4fd",
    200: "#b7c9fb",
    300: "#8fadf8",
    400: "#5a82f1",
    500: "#2e5bdc",
    600: "#2549b0",
    700: "#1d3a8a",
    800: "#162c66",
    900: "#0f1e44",
  },
  accent: {
    purple: "#8c44d9",
    green: "#04bf0c",
    orange: "#ffa543",
    red: "#ec4343",
    cyan: "#38d1f1",
    blue: "#5a82f1",
  },
};

const sans = ["Rubik", "sans-serif"].join(",");
const mono = ["Space Mono", "monospace"].join(",");
const ease = "cubic-bezier(0.25, 0.46, 0.45, 0.94)";

// mui theme settings
export const themeSettings = (mode) => {
  const isDark = mode === "dark";
  const divider = isDark ? "rgba(157,165,180,0.22)" : colorTokens.line;
  const hairline = isDark ? "rgba(157,165,180,0.30)" : "#d8dfec";

  return {
    palette: {
      mode: mode,
      primary: isDark
        ? {
            dark: colorTokens.primary[200],
            main: colorTokens.primary[400],
            light: colorTokens.primary[800],
          }
        : {
            dark: colorTokens.primary[700],
            main: colorTokens.primary[500],
            light: colorTokens.primary[50],
          },
      secondary: {
        main: colorTokens.accent.purple,
        dark: "#6c2fb0",
        light: "#f3e6fb",
      },
      neutral: isDark
        ? {
            dark: colorTokens.muted,
            main: "#c3c9d4",
            mediumMain: "#aab2c0",
            medium: "#8f97a6",
            light: "#232a36",
          }
        : {
            dark: colorTokens.ink,
            main: "#5b6472",
            mediumMain: "#8b93a3",
            medium: colorTokens.muted,
            light: colorTokens.canvas,
          },
      background: isDark
        ? { default: "#12161f", alt: "#1b2130" }
        : { default: colorTokens.canvas, alt: colorTokens.surface },
      text: isDark
        ? { primary: "#eef1f7", secondary: colorTokens.muted }
        : { primary: colorTokens.ink, secondary: "#6b7484" },
      divider: divider,
      success: { main: colorTokens.accent.green },
      warning: { main: colorTokens.accent.orange },
      error: { main: colorTokens.accent.red },
      info: { main: colorTokens.accent.cyan },
    },
    shape: { borderRadius: 10 },
    typography: {
      fontFamily: sans,
      fontSize: 12,
      h1: { fontFamily: sans, fontSize: 40 },
      h2: { fontFamily: sans, fontSize: 32 },
      h3: { fontFamily: sans, fontSize: 24 },
      h4: { fontFamily: sans, fontSize: 20 },
      h5: { fontFamily: sans, fontSize: 16 },
      h6: { fontFamily: sans, fontSize: 14 },
      button: { fontFamily: sans, fontWeight: 600, letterSpacing: 0, textTransform: "none" },
      overline: {
        fontFamily: mono,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
      },
      caption: { fontFamily: mono, fontSize: 11, letterSpacing: "0.04em" },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: { backgroundColor: isDark ? "#12161f" : colorTokens.canvas },
        },
      },
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: {
            borderRadius: 7,
            textTransform: "none",
            fontWeight: 600,
            padding: "8px 18px",
            transition: `all 250ms ${ease}`,
          },
          sizeSmall: { padding: "6px 14px", borderRadius: 6 },
          contained: {
            boxShadow: "0 1px 2px rgba(33,37,43,0.10)",
            "&:hover": {
              boxShadow: "0 8px 20px rgba(46,91,220,0.24)",
              transform: "translateY(-1px)",
            },
          },
          outlined: {
            borderColor: hairline,
            "&:hover": {
              borderColor: colorTokens.primary[500],
              backgroundColor: "rgba(46,91,220,0.06)",
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
            border: `1px solid ${divider}`,
            boxShadow: isDark ? "none" : "0 1px 2px rgba(33,37,43,0.04)",
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: { borderRadius: 7, fontFamily: sans },
          notchedOutline: { borderColor: hairline },
        },
      },
      MuiChip: {
        styleOverrides: { root: { borderRadius: 7, fontWeight: 600 } },
      },
      MuiTableCell: {
        styleOverrides: {
          head: {
            fontFamily: mono,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: colorTokens.muted,
          },
          rule: { borderColor: divider },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            borderRadius: 7,
            fontSize: 12,
            backgroundColor: colorTokens.ink,
            padding: "6px 10px",
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            borderRadius: 7,
            transition: "background-color 200ms ease, color 200ms ease",
          },
        },
      },
      MuiPagination: {
        styleOverrides: { root: { "& .MuiPaginationItem-root": { borderRadius: 7 } } },
      },
    },
  };
};
