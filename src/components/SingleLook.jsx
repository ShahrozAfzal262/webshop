import { useState } from "react";
export default function SingleLook({ look, onBack, onAdd }) {
  const [open, setOpen] = useState(null);
  const spots = look.hotspots || [{ x: 50, y: 30, p: 0 }, { x: 50, y: 66, p: 1 }];
  return <section className="single" key={look.id}>
    <div className="single-intro"><span className="eyebrow">LOOK 0{look.id}</span><h1>{look.name}</h1><p>Tap a detail to discover the pieces.</p></div>
    <div className="figure"><img src={look.image} alt={look.name} draggable="false" />{spots.map((hotspot, index) => {
      const product = look.products[hotspot.p];
      return <button key={index} className={`spot ${open === index ? "spot-open" : ""}`} style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }} onClick={() => setOpen(open === index ? null : index)} aria-label={`Show ${product.name}`}>
        {open === index ? <span className="tag" onClick={(e) => { e.stopPropagation(); onAdd(product, "M"); setOpen(null); }}>{product.name} · ${product.price} · ADD +</span> : <i />}
      </button>;
    })}</div>
    <button className="single-back" onClick={onBack}>← BACK TO THE EDIT</button>
  </section>;
}
