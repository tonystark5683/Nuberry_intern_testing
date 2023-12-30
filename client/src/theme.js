// color design tokens export
export const tokensDark = {
  grey: {
    0: "#ffffff", // manually adjusted
    10: "#f6f6f6", // manually adjusted
    50: "#f0f0f0", // manually adjusted
    100: "#e0e0e0",
    200: "#c2c2c2",
    300: "#a3a3a3",
    400: "#858585",
    500: "#666666",
    600: "#525252",
    700: "#3d3d3d",
    800: "#292929",
    900: "#141414",
    1000: "#000000", // manually adjusted
  },
  primary: {
    // blue
    100: "#d3d4de",
    200: "#a6a9be",
    300: "#7a7f9d",
    400: "#4d547d",
    500: "#21295c",
    600: "#191F45", // manually adjusted
    700: "#141937",
    800: "#0d1025",
    900: "#070812",
  },
  secondary: {
    // yellow
    50: "#f0f0f0", // manually adjusted
    100: "#fff6e0",
    200: "#ffedc2",
    300: "#ffe3a3",
    400: "#ffda85",
    500: "#ffd166",
    600: "#cca752",
    700: "#997d3d",
    800: "#665429",
    900: "#332a14",
  },
};

// function that reverses the color palette
function reverseTokens(tokensDark) {
  const reversedTokens = {};
  Object.entries(tokensDark).forEach(([key, val]) => {
    const keys = Object.keys(val);
    const values = Object.values(val);
    const length = keys.length;
    const reversedObj = {};
    for (let i = 0; i < length; i++) {
      reversedObj[keys[i]] = values[length - i - 1];
    }
    reversedTokens[key] = reversedObj;
  });
  return reversedTokens;
}
export const tokensLight = reverseTokens(tokensDark);

// mui theme settings
export const themeSettings = (mode) => {
  return {
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
            // palette values for dark mode
            primary: {
              ...tokensDark.primary,
              main: tokensDark.primary[400],
              light: tokensDark.primary[400],
            },
            secondary: {
              ...tokensDark.secondary,
              main: tokensDark.secondary[300],
            },
            neutral: {
              ...tokensDark.grey,
              main: tokensDark.grey[500],
            },
            background: {
              default: tokensDark.primary[600],
              alt: tokensDark.primary[500],
            },
          }
        : {
            // palette values for light mode
            primary: {
              ...tokensLight.primary,
              main: tokensDark.secondary[50],
              light: tokensDark.secondary[100],
            },
            secondary: {
              ...tokensLight.secondary,
              main: tokensDark.secondary[600],
              light: tokensDark.secondary[700],
            },
            neutral: {
              ...tokensLight.secondary,
              main: tokensDark.secondary[500],
            },
            background: {
              default: tokensDark.secondary[300],
              alt: tokensDark.secondary[200],
            },
          }),
    },
    typography: {
      fontFamily: ["Inter", "sans-serif"].join(","),
      fontSize: 8,
      h1: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 25,
      },
      h2: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 22,
      },
      h3: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 18,
      },
      h4: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 16,
      },
      h5: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 13,
      },
      h6: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 10,
      },
    },
  };
};

export const baseColors = {
  1: "#A6FF96",
  2: "#FE0000",
  3: "#E26EE5",
  4: "#39A7FF",
  5: "#F0DE36",
  6: "#ff9999",
  7: "#FF5B22",
  8: "#ffea7e",
  9: "#fffaaa",
  10: "#4d94ff",
  11: "#66a6ff",
  12: "#3380cc",
  13: "#4d8fb3",
  14: "#1a66cc",
  15: "#336699",
  16: "#004080",
  17: "#005799",
  18: "#001a33",
  19: "#002233",
  20: "#5c6f7a",
  21: "#a3d4ff",
  22: "#2a9bff",
  23: "#79c4ff",
  24: "#ffa74d",
  25: "#ffbf7a",
  26: "#ff9999",
  27: "#ffadad",
  28: "#ffea7e",
  29: "#fffaaa",
  30: "#4d94ff",
  31: "#66a6ff",
  32: "#3380cc",
  33: "#4d8fb3",
  34: "#1a66cc",
  35: "#336699",
  36: "#004080",
  37: "#005799",
  38: "#001a33",
  39: "#002233",
  40: "#5c6f7a",
  41: "#a3d4ff",
  42: "#2a9bff",
  43: "#79c4ff",
  44: "#ffa74d",
  45: "#ffbf7a",
  46: "#ff9999",
  47: "#ffadad",
  48: "#ffea7e",
  49: "#fffaaa",
  50: "#4d94ff",
};
