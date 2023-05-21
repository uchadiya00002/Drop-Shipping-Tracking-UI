// const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {},
    fontFamily: {
      poppins: ["Poppins", "sans-serif"],
      roboto: ["Roboto", "sans-serif"],
      ssp: ["Source Sans Pro", "sans-serif"],
      gbp: ["Gentium Book Plus", "sans-serif"],
    },
    backgroundColor: {
      "primary-bg": "#1A202C",
      "light-gray": "#E5E5E5",
      "dark-gray": "#6B7280",
      ordered: "#3ED331",
      confirmed: "#e3d408",
      shipped: "#5196DB",
      "part-shipped": "#B0E0E6",
      received: "green",
      "part-received": "#6ea642",
      rejected: "rgb(187, 40, 40)",
      "part-rejected": "#F17B33",
    },
    color: {
      "primary-bg": "#03045E",
      "light-gray": "#F3F4F6",
      "icon-gray": "#9CAABF",
    },
    screens: {
      xs: { min: "320px", max: "767px" },
      md: { min: "769px", max: "1024px" },
      lg: { min: "1025px", max: "1500px" },
      xl: { min: "1501px", max: "1800px" },
    },
  },
  variants: {
    color: ["responsive", "hover", "focus", "active"],
    visibility: ["responsive", "hover", "focus"],
  },
  plugins: [],
};
