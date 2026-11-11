import { useState } from "react";
const sizes = ["XS", "S", "M", "L", "XL"];
const adjustment = { XS: -4, S: 0, M: 0, L: 4, XL: 8 };

export default function ProductPanel({ look, onAdd, onAddAll }) {
  const [chosen, setChosen] = useState({});
  const total = look.products.reduce((sum, product) => sum + product.price, 0);
  return <aside className="panel" key={look.id}>
    <div className="panel-heading"><div><span className="eyebrow">CURATED OUTFIT</span><h2>In this look<span>.</span></h2></div><span className="piece-count">0{look.products.length} PIECES</span></div>
    <ul>{look.products.map((product) => {
      const size = chosen[product.id] || "M", price = product.price + adjustment[size];
      return <li key={product.id} className="product-row"><img className="thumb" src={product.image} alt={product.name} draggable="false" />
        <div className="info"><span className="ptype">{product.type}</span><span className="pname">{product.name}</span>
          <div className="product-meta"><span className="price">${price}</span><span className="size-label">SIZE</span></div>
          <div className="size-picker" role="group" aria-label={`Choose size for ${product.name}`}>{sizes.map((item) => <button key={item} className={size === item ? "active" : ""} onClick={() => setChosen((old) => ({ ...old, [product.id]: item }))}>{item}</button>)}</div>
          <button className="add-piece" onClick={() => onAdd(product, size)}>ADD TO BAG <span>+</span></button>
        </div>
      </li>;
    })}</ul>
    <button className="bag" onClick={onAddAll}>ADD FULL LOOK <span>${total}</span><i>↗</i></button>
  </aside>;
}
