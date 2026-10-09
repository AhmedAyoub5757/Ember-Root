export const MESSAGE_MAX = 140;

export const BUNDLES = {
  trio: {
    id: "trio",
    name: "The Trio Box",
    type: "pick",
    count: 3,
    sizes: ["60", "150"],
    discount: 0.10,
  },
  starter: {
    id: "starter",
    name: "The Starter",
    type: "set",
    flavors: ["kashmiri-red", "green-jalapeno-lime"],
    size: "150",
    discount: 0.08,
    blurb: "Two bright, everyday sauces to start your table.",
  },
  ladder: {
    id: "ladder",
    name: "The Heat Ladder",
    type: "set",
    flavors: [
      "kashmiri-red",
      "green-jalapeno-lime",
      "mango-habanero",
      "smoked-chipotle",
      "garlic-serrano",
      "ghost-reserve",
    ],
    size: "60",
    discount: 0.12,
    blurb: "Six bottles that climb from warm to wonderfully reckless.",
  },
  "smoke-fire": {
    id: "smoke-fire",
    name: "Smoke & Fire",
    type: "set",
    flavors: ["smoked-chipotle", "garlic-serrano", "ghost-reserve"],
    size: "150",
    discount: 0.10,
    blurb: "A dark, smoky trio for tables that like a little danger.",
  },
};
