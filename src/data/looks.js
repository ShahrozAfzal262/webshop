
const coreLooks = [
  {
    id: 1,
    name: "Slate Crew",
    image: "/images/looks/look1.png",
    products: [
      { id: "p1", type: "Sweater", name: "Crewneck Sweater", price: 59, image: "/images/products/p1.jpg" },
      { id: "p2", type: "Pants", name: "Straight Denim", price: 79, image: "/images/products/p2.jpg" },
      { id: "p3", type: "Shoes", name: "Low Sneakers", price: 95, image: "/images/products/p3.jpg" },
    ],
  },
  {
    id: 2,
    name: "Wine Layer",
    image: "/images/looks/look2.png",
    products: [
      { id: "p4", type: "Sweater", name: "Wine Knit", price: 64, image: "/images/products/p4.jpg" },
      { id: "p5", type: "Pants", name: "Relaxed Chinos", price: 69, image: "/images/products/p5.jpg" },
      { id: "p6", type: "Hat", name: "Wool Beanie", price: 25, image: "/images/products/p6.jpg" },
    ],
  },
  {
    id: 3,
    name: "Core Black",
    image: "/images/looks/look3.png",
    products: [
      { id: "p7", type: "Tee", name: "Boxy Tee", price: 35, image: "/images/products/p7.jpg" },
      { id: "p8", type: "Pants", name: "Cargo Pants", price: 85, image: "/images/products/p8.jpg" },
      { id: "p9", type: "Hat", name: "Canvas Cap", price: 22, image: "/images/products/p9.jpg" },
    ],
  },
  {
    id: 4,
    name: "Sand Set",
    image: "/images/looks/look4.png",
    products: [
      { id: "p10", type: "Tee", name: "Linen Shirt", price: 55, image: "/images/products/p10.jpg" },
      { id: "p11", type: "Pants", name: "Wide Trousers", price: 72, image: "/images/products/p11.jpg" },
      { id: "p12", type: "Shoes", name: "Leather Slides", price: 48, image: "/images/products/p12.jpg" },
    ],
  },
  {
    id: 5,
    name: "Forest Walk",
    image: "/images/looks/look5.png",
    products: [
      { id: "p13", type: "Overshirt", name: "Forest Overshirt", price: 78, image: "/images/products/p13.jpg" },
      { id: "p14", type: "Pants", name: "Tapered Jeans", price: 74, image: "/images/products/p14.jpg" },
      { id: "p15", type: "Shoes", name: "Trail Sneakers", price: 110, image: "/images/products/p15.jpg" },
    ],
  },
];

export const getSizes = (product) =>
  product.type.toLowerCase().includes("shoe")
    ? ["40", "41", "42", "43"]
    : ["S", "M", "L", "XL"];

export const getSizePrice = (product, size) => {
  const sizes = getSizes(product);
  const index = sizes.indexOf(size);
  const adjustments = [-5, 0, 5, 10];

  return product.price + adjustments[Math.max(0, index)];
};

export const looks = [
  ...coreLooks,
  {
    id: 6,
    name: "Linen Layers",
    image: "/images/looks/look6.png",
    products: coreLooks[3].products.map((product) => ({
      ...product,
      id: `look6-${product.id}`,
    })),
  },
  {
    id: 7,
    name: "Scarlet Statement",
    image: "/images/looks/look7.png",
    products: coreLooks[1].products.map((product) => ({
      ...product,
      id: `look7-${product.id}`,
    })),
  },
  {
    id: 8,
    name: "City Layers",
    image: "/images/looks/look8.png",
    products: coreLooks[4].products.map((product) => ({
      ...product,
      id: `look8-${product.id}`,
    })),
  },
  {
    id: 9,
    name: "Studio Stripes",
    image: "/images/looks/look9.png",
    products: coreLooks[2].products.map((product) => ({
      ...product,
      id: `look9-${product.id}`,
    })),
  },
  {
    id: 10,
    name: "Blue Hour",
    image: "/images/looks/look10.png",
    products: coreLooks[0].products.map((product) => ({
      ...product,
      id: `look10-${product.id}`,
    })),
  },
];
