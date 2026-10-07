export const TOTAL_DAYS = 260;

// `day` = the day the counter shows when this chapter is centred on screen
export const chapters = [
  {
    no: "01", name: "Seed", art: "seed",
    season: "March", days: "Day 000 – 021", day: 0,
    bg: "#F2EBDD", ink: "#1F1A14",
    text: "Seeds go into trays in early spring, sown by hand and kept warm until the first green hooks break the soil. Every year we save seed from the strongest plants.",
    data: [["Sown", "Early March"], ["Medium", "Compost + river sand"], ["Germination", "10 – 21 days"]],
    note: "We keep seed from the strongest plant of each year.",
  },
  {
    no: "02", name: "Sun", art: "sun",
    season: "April – August", days: "Day 022 – 150", day: 90,
    bg: "#D9A21B", ink: "#1F1A14",
    text: "Out in the field the plants do the one thing that makes heat: they struggle a little. Full sun, measured water, no shortcuts. Fruit sets in June and colors up slowly through July.",
    data: [["Field", "Open, full sun"], ["Water", "Rain-fed, drip in drought"], ["To ripen", "~150 days"]],
    note: "A thirsty plant makes a hotter pepper.",
  },
  {
    no: "03", name: "Fire", art: "fire",
    season: "August", days: "Day 151 – 158", day: 154,
    bg: "#B8321F", ink: "#F2EBDD",
    text: "Harvest is by hand, and only fully colored fruit. Within a day it's fire-roasted or smoked over wood, which is where the sweetness and the depth come from.",
    data: [["Picked", "By hand, at full color"], ["Roast", "Open flame, 8 min"], ["Smoke", "Fruitwood, 6 hrs"]],
    note: "The kitchen smells like this for one week a year.",
  },
  {
    no: "04", name: "Time", art: "time",
    season: "September – November", days: "Day 159 – 249", day: 204,
    bg: "#1F1A14", ink: "#F2EBDD",
    text: "Mashed with salt, packed into crocks and left alone. Ninety days of quiet fermentation turns raw heat into something rounder. It's the one step we can't speed up, so we stopped trying.",
    data: [["Salt", "2.5% by weight"], ["Vessel", "Ceramic crock"], ["Time", "90 days, minimum"]],
    note: "Every Friday we open one crock and taste. Nothing leaves early.",
  },
  {
    no: "05", name: "Glass", art: "glass",
    season: "December", days: "Day 250 – 260", day: 260,
    bg: "#F2EBDD", ink: "#1F1A14",
    text: "Blended, tasted (by tongue, not by timer) and bottled in glass by the same hands. Every label carries a batch number, so any bottle can be traced back to its field.",
    data: [["Bottle", "150 ml glass, hand-filled"], ["Batch", "Numbered and dated"], ["Additives", "None"]],
    note: "Look for the batch number on the back label.",
  },
];