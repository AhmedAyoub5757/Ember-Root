const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PK_MOBILE = /^(?:\+92|0092|92|0)?3\d{9}$/;
const clean = (s) => s.replace(/[^\d+]/g, "");

export function validate(v, method) {
  const e = {};
  const pk = v.country === "PK";
  const phone = clean(v.phone);

  if (v.name.trim().length < 2) e.name = "Please enter your full name.";
  if (!EMAIL.test(v.email.trim())) e.email = "That doesn't look like an email address.";

  if (pk ? !PK_MOBILE.test(phone) : !/^\+?\d{7,15}$/.test(phone)) {
    e.phone = pk
      ? "Use a Pakistani mobile number, like 0300 1234567."
      : "Enter a number we can reach, with the country code.";
  }

  if (v.address.trim().length < 6) e.address = "Add your street address and house or flat number.";
  if (v.city.trim().length < 2) e.city = "Which city?";
  if (!v.province.trim()) e.province = pk ? "Choose a province." : "Add your state or region.";
  if (!pk && v.postal.trim().length < 3) e.postal = "Add your postal code.";

  if (method === "easypaisa" && !PK_MOBILE.test(clean(v.wallet))) {
    e.wallet = "Enter the mobile number linked to your Easypaisa account.";
  }
  return e;
}