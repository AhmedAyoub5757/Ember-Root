// Sizes: `mult` scales the 150 ml price, `scale` scales the bottle on screen,
// `h` and `d` are the drawn dimensions in mm. Adjust to your real bottles.
export const sizes = [
  { id: "60",  ml: 60,  label: "Taster",   note: "Try it first", mult: 0.55, scale: 0.8,  h: 118, d: 40 },
  { id: "150", ml: 150, label: "Standard", note: "Most chosen",  mult: 1,    scale: 1,    h: 175, d: 52 },
  { id: "300", ml: 300, label: "Family",   note: "Best value",   mult: 1.8,  scale: 1.18, h: 214, d: 64 },
];
export const defaultSize = "150";

// PLACEHOLDER copy. Replace with your real recipes.
export const extra = {
  "kashmiri-red": {
    tasting: [["Opens", "Warm cumin and dried chili skin"], ["Middle", "Mustard oil with a little sweetness"], ["Finish", "A gentle, round burn that fades in a minute"]],
    inside: "Sun-dried Kashmiri chili, cold-pressed mustard oil, roasted cumin, garlic, sea salt, lime juice.",
  },
  "mango-habanero": {
    tasting: [["Opens", "Ripe mango and jaggery"], ["Middle", "Floral habanero, apricot-like"], ["Finish", "Heat arrives late and stays warm"]],
    inside: "Sindhri mango, orange habanero, jaggery, lime juice, sea salt, garlic.",
  },
  "green-jalapeno-lime": {
    tasting: [["Opens", "Lime zest and fresh coriander"], ["Middle", "Grassy, crisp jalapeño"], ["Finish", "Bright and clean, gone quickly"]],
    inside: "Green jalapeño, lime juice and zest, coriander stem, garlic, sea salt.",
  },
  "smoked-chipotle": {
    tasting: [["Opens", "Wood smoke and tamarind"], ["Middle", "Dark, a little sweet, black cardamom"], ["Finish", "A slow heat that builds"]],
    inside: "Fruitwood-smoked red jalapeño, tamarind, black cardamom, jaggery, sea salt.",
  },
  "garlic-serrano": {
    tasting: [["Opens", "Mellow roasted garlic"], ["Middle", "Salty, nutty, rounded"], ["Finish", "Serrano comes in sharp and clean"]],
    inside: "Slow-roasted garlic, serrano chili, sea salt, lime juice, cold-pressed mustard oil.",
  },
  "ghost-reserve": {
    tasting: [["Opens", "Fruity, almost sweet"], ["Middle", "Fermented depth, slight funk"], ["Finish", "Long, creeping fire. Keep milk nearby"]],
    inside: "Fermented naga bhut jolokia, sea salt, jaggery, garlic.",
  },
};

// PLACEHOLDER numbers. Replace with real, tested values for each sauce.
export const nutrition = {
  per: "per 5 ml serving",
  rows: [["Energy", "4 kcal"], ["Fat", "0.1 g"], ["Carbohydrate", "0.8 g"], ["of which sugars", "0.4 g"], ["Protein", "0.1 g"], ["Salt", "0.15 g"]],
};

export const shelf = "Refrigerate after opening. Best within 6 months.";