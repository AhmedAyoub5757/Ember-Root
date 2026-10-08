export const countries = [
  ["PK", "Pakistan"],
  ["AE", "United Arab Emirates"],
  ["SA", "Saudi Arabia"],
  ["GB", "United Kingdom"],
  ["US", "United States"],
  ["CA", "Canada"],
  ["DE", "Germany"],
  ["AU", "Australia"],
];
export const countryName = Object.fromEntries(countries);

export const provinces = [
  "Punjab", "Sindh", "Khyber Pakhtunkhwa", "Balochistan",
  "Islamabad Capital Territory", "Gilgit-Baltistan", "Azad Jammu & Kashmir",
];

// pkOnly methods are hidden for other countries
export const methods = [
  { id: "card",      name: "Card",             via: "Visa, Mastercard · Stripe", pkOnly: false },
  { id: "paypal",    name: "PayPal",           via: "Pay with your PayPal balance or card", pkOnly: false },
  { id: "easypaisa", name: "Easypaisa",        via: "Mobile account", pkOnly: true },
  { id: "cod",       name: "Cash on delivery", via: "Pay the rider in cash", pkOnly: true },
];
export const methodName = Object.fromEntries(methods.map((m) => [m.id, m.name]));

// PLACEHOLDER estimates
export const etaFor = (country) => (country === "PK" ? "2–4 working days" : "7–14 working days");