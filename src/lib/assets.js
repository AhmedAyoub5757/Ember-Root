const bottles = import.meta.glob("../assets/images/bottle-*.png", {
  eager: true,
  import: "default",
});

export const bottleFor = (id) => bottles[`../assets/images/bottle-${id}.png`];