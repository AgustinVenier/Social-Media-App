import { createSystem, defaultConfig } from "@chakra-ui/react";

const theme = createSystem(defaultConfig, {
  theme: {
    tokens: {
      colors: {
        primary: { value: "#3182ce" },
        secondary: { value: "#ed8936" },
        accent: { value: "#9f7aea" },
      },
      fonts: {
        body: { value: "'Inter', sans-serif" },
        heading: { value: "'Poppins', sans-serif" },
      },
    },
    semanticTokens: {
      colors: {
        bg: { value: "#f7fafc" },
        bgDark: { value: "#1a202c" },
        text: { value: "#2d3748" },
        textLight: { value: "#718096" },
      },
    },
  },
  globalCss: {
    body: {
      bg: "bg",
      color: "text",
      fontFamily: "body",
      lineHeight: "1.6",
    },
    "h1, h2, h3, h4, h5, h6": {
      fontFamily: "heading",
      fontWeight: "bold",
    },
    a: {
      color: "primary",
      _hover: {
        textDecoration: "underline",
      },
    },
  },
});

export default theme;
