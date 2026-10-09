import { loadStripe } from "@stripe/stripe-js";

const key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
export const stripePromise = key ? loadStripe(key) : null;

const mono = '"IBM Plex Mono", ui-monospace, monospace';

export const fonts = [
  {
    cssSrc:
      "https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500&family=IBM+Plex+Mono:wght@400&display=swap",
  },
];

export const appearance = {
  theme: "flat",
  variables: {
    fontFamily: '"Hanken Grotesk", system-ui, sans-serif',
    fontSizeBase: "16px",
    colorPrimary: "#1F1A14",
    colorText: "#1F1A14",
    colorBackground: "#F2EBDD",
    colorDanger: "#B8321F",
    borderRadius: "0px",
    spacingUnit: "5px",
  },
  rules: {
    ".Input": {
      backgroundColor: "transparent",
      border: "0",
      borderBottom: "2px solid rgba(31,26,20,0.4)",
      boxShadow: "none",
      padding: "10px 0",
    },
    ".Input:focus": { borderBottom: "2px solid #1F1A14", boxShadow: "none", outline: "none" },
    ".Label": {
      fontFamily: mono,
      fontSize: "11px",
      letterSpacing: "0.12em",
      textTransform: "uppercase",
    },
    ".Error": { fontFamily: mono, fontSize: "11px" },
  },
};