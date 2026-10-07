export const ingredients = [
  {
    id: "habanero", no: "01", plate: "habanero",
    name: "Habanero", latin: "Capsicum chinense", role: "Fruity heat",
    text: "Orange habaneros taste of apricot and flowers before the heat arrives. We grow them in the lowest, warmest corner of the field and pick each one by hand at full color.",
    facts: [["Grown", "Estate field, plot 03"], ["Cultivar", "Orange habanero"], ["Heat", "100K – 350K SHU"]],
    months: [6, 7, 8, 9],
    used: ["mango-habanero"],
    note: "Gloves on. We learned that the hard way.",
    pins: [
      { x: 50, y: 20, t: "Calyx", d: "The green cap. A fresh, firm calyx tells us the fruit came off the plant today." },
      { x: 50, y: 52, t: "Pod wall", d: "Thin, glossy and floral. This is where the apricot note lives." },
      { x: 52, y: 80, t: "Placenta", d: "The pale ribs that hold the seeds. Most of the capsaicin sits here." },
    ],
  },
  {
    id: "mango", no: "02", plate: "mango",
    name: "Sindhri Mango", latin: "Mangifera indica", role: "Sweetness",
    text: "Sweetness should come from fruit, not from a sack of sugar. We use fully tree-ripened Sindhri mangoes for their low fiber and deep, honeyed flavor.",
    facts: [["Grown", "Partner orchards, Sindh"], ["Cultivar", "Sindhri"], ["Ripened", "On the tree"]],
    months: [4, 5, 6, 7],
    used: ["mango-habanero"],
    note: "We smell every crate before it's unloaded.",
    pins: [
      { x: 50, y: 25, t: "Shoulder", d: "A deep, rounded shoulder usually means a heavy, sweet fruit." },
      { x: 50, y: 55, t: "Flesh", d: "Soft, golden and almost fiber-free, so the sauce stays silky." },
      { x: 50, y: 78, t: "Stone", d: "Set aside and never pressed. It's the one part we don't use." },
    ],
  },
  {
    id: "jalapeno", no: "03", plate: "jalapeno",
    name: "Jalapeño", latin: "Capsicum annuum", role: "Green & smoke",
    text: "One plant, two sauces. Picked green, it becomes the bright jalapeño and lime. Left to turn red and smoked over fruitwood, it becomes the chipotle.",
    facts: [["Grown", "Estate field, plot 01"], ["Cultivar", "Early jalapeño"], ["Heat", "2,500 – 8,000 SHU"]],
    months: [6, 7, 8, 9],
    used: ["green-jalapeno-lime", "smoked-chipotle"],
    note: "Fine tan lines on the skin mean a hotter pepper.",
    pins: [
      { x: 50, y: 24, t: "Shoulder", d: "Small tan lines here are called corking. The pepper was stressed, and it's usually hotter." },
      { x: 50, y: 52, t: "Green flesh", d: "Thick, crisp and grassy. This is the base of the green sauce." },
      { x: 52, y: 80, t: "Ripe red", d: "Left on the plant for three more weeks, then smoked until leathery." },
    ],
  },
  {
    id: "garlic", no: "04", plate: "garlic",
    name: "Garlic", latin: "Allium sativum", role: "Depth",
    text: "Whole heads, roasted slowly until the sharpness softens into something sweet and nutty. It's the quiet base under the serrano.",
    facts: [["Planted", "By hand, in autumn"], ["Roast", "Whole heads, 2 hrs"], ["Cured", "3 weeks, in shade"]],
    months: [3, 4, 5],
    used: ["garlic-serrano"],
    note: "The only ingredient that makes the whole building smell good.",
    pins: [
      { x: 50, y: 28, t: "Neck", d: "Cured in the shade for three weeks, so the skins turn papery and the flavor settles." },
      { x: 50, y: 56, t: "Cloves", d: "Roasted until they squeeze out like butter. Never raw." },
      { x: 50, y: 88, t: "Root plate", d: "Trimmed by hand before roasting." },
    ],
  },
  {
    id: "ghost", no: "05", plate: "ghost",
    name: "Ghost Pepper", latin: "Capsicum chinense", role: "Fire",
    text: "Naga bhut jolokia. Slow, creeping and enormous. We grow only forty plants a year, ferment them for ninety days and bottle them in the smallest batch we make.",
    facts: [["Grown", "Small plot, 40 plants"], ["Cultivar", "Naga bhut jolokia"], ["Heat", "~1,000,000 SHU"]],
    months: [8, 9, 10],
    used: ["ghost-reserve"],
    note: "Our test kitchen is a room with all the windows open.",
    pins: [
      { x: 50, y: 22, t: "Calyx", d: "Picked with a long stem to keep the fruit from bruising." },
      { x: 50, y: 52, t: "Wrinkled skin", d: "The dimpled, lumpy skin is a sign of a ripe, well-grown fruit." },
      { x: 55, y: 82, t: "Tail", d: "The curled tip. It looks harmless, which is the point." },
    ],
  },
];

export const inJar = ["Sea salt", "Cold-pressed mustard oil", "Jaggery", "Lime", "Tamarind", "Fruitwood smoke"];
export const neverJar = ["Preservatives", "Artificial colour", "Thickeners", "Added water"];