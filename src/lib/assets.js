const bottles = import.meta.glob("../assets/images/bottle-*.png", {
  eager: true,
  import: "default",
});

export const bottleFor = (id) => bottles[`../assets/images/bottle-${id}.png`];

const plates = import.meta.glob("../assets/images/botanical-*.{png,jpg,jpeg,webp}", {
  eager: true,
  import: "default",
});

const norm = (s) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export const botanicalFor = (key) => {
  const hit = Object.entries(plates).find(([path]) => norm(path).includes(norm(key)));
  return hit?.[1];
};