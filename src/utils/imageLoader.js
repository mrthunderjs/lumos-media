const images = import.meta.glob("../data/images/*", {
  eager: true,
  import: "default",
});

export function getImage(filename) {
  return images[`../data/images/${filename}`];
}