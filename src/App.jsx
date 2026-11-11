import { useEffect, useState } from "react";
import { looks } from "./data/looks";
import Header from "./components/Header";
import Lineup from "./components/Lineup";
import SingleLook from "./components/SingleLook";
import ProductPanel from "./components/ProductPanel";
import "./styles/App.css";

const sizeAdjustments = { XS: -4, S: 0, M: 0, L: 4, XL: 8 };

export default function App() {
  const [view, setView] = useState("lineup");
  const [focus, setFocus] = useState(2);
  const [selected, setSelected] = useState(2);
  const [cart, setCart] = useState([]);
  const [bagOpen, setBagOpen] = useState(false);
  const look = looks[view === "single" ? selected : focus];
  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);

  const back = () => { setFocus(selected); setView("lineup"); };
  const pick = (index) => { setSelected(index); setView("single"); };
  const addToCart = (product, size = "M") => {
    const price = product.price + (sizeAdjustments[size] ?? 0);
    setCart((items) => [...items, { ...product, size, price, cartId: `${product.id}-${size}-${Date.now()}-${Math.random()}` }]);
    setBagOpen(true);
  };
  const addFullLook = (products) => {
    setCart((items) => [...items, ...products.map((product) => ({ ...product, size: "M", price: product.price, cartId: `${product.id}-M-${Date.now()}-${Math.random()}` }))]);
    setBagOpen(true);
  };

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") { setBagOpen(false); if (view === "single") back(); }
      if (view === "single" && event.key === "ArrowRight") setSelected((i) => Math.min(looks.length - 1, i + 1));
      if (view === "single" && event.key === "ArrowLeft") setSelected((i) => Math.max(0, i - 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [view, selected]);

  return (
    <main className="shop">
      <Header view={view} title={look.name} onBack={back} count={cart.length} onBag={() => setBagOpen(true)} />
      <div className="collection-note"><span className="eyebrow">THE EVERYDAY EDIT · 2026</span><span className="note-line" /><span className="collection-count">0{(view === "single" ? selected : focus) + 1} <i>/ 0{looks.length}</i></span></div>
      {view === "lineup" ? <Lineup looks={looks} start={focus} onPick={pick} onFocus={setFocus} /> : <SingleLook look={look} onBack={back} onAdd={addToCart} />}
      <ProductPanel look={look} onAdd={addToCart} onAddAll={() => addFullLook(look.products)} />
      <footer className="bottom-note"><span>CONSIDERED STYLE. MADE TO MOVE.</span><span>DRAG TO EXPLORE <b>↔</b></span></footer>

      {bagOpen && <div className="drawer-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) setBagOpen(false); }}>
        <aside className="bag-drawer" aria-label="Shopping bag">
          <div className="drawer-head"><div><span className="eyebrow">YOUR SELECTION</span><h2>Shopping bag <span>({cart.length})</span></h2></div><button className="close-btn" onClick={() => setBagOpen(false)} aria-label="Close bag">×</button></div>
          {cart.length ? <><div className="bag-items">{cart.map((item) => <div className="bag-item" key={item.cartId}>
            <img src={item.image} alt={item.name} /><div className="bag-item-info"><span className="ptype">{item.type}</span><strong>{item.name}</strong><span>Size: {item.size}</span><b>${item.price.toFixed(2)}</b></div>
            <button className="remove-item" onClick={() => setCart((items) => items.filter((x) => x.cartId !== item.cartId))}>Remove</button>
          </div>)}</div><div className="drawer-total"><span>Subtotal</span><strong>${cartTotal.toFixed(2)}</strong></div><button className="checkout-btn" onClick={() => alert("Your bag is ready. Connect checkout to a store backend to accept orders.")}>Continue to checkout <span>↗</span></button><p className="drawer-footnote">Shipping and taxes calculated at checkout.</p></>
          : <div className="empty-bag"><span>✳</span><h3>Your bag is waiting.</h3><p>Explore the edit and add something you love.</p><button onClick={() => setBagOpen(false)}>Continue exploring ↗</button></div>}
        </aside>
      </div>}
    </main>
  );
}
