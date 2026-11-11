
import { useState, useEffect } from "react";
import { looks, getSizes, getSizePrice } from "./data/looks";
import Header from "./components/Header";
import Lineup from "./components/Lineup";
import SingleLook from "./components/SingleLook";
import ProductPanel from "./components/ProductPanel";
import ProductDetail from "./components/ProductDetail";
import "./styles/App.css";

export default function App() {
  const [view, setView] = useState("lineup");
  const [focus, setFocus] = useState(2);
  const [selected, setSelected] = useState(2);
  const [cart, setCart] = useState([]);
  const [activeProduct, setActiveProduct] = useState(null);

  const back = () => {
    setFocus(selected);
    setView("lineup");
  };

  const pick = (i) => {
    setSelected(i);
    setView("single");
  };

  const addToCart = (product) => {
    setCart((current) => [...current, product]);
    setActiveProduct(null);
  };

  const addAllToCart = (products) => {
    const items = products.map((product) => {
      const size = getSizes(product)[1];

      return {
        ...product,
        size,
        basePrice: product.price,
        price: getSizePrice(product, size),
        cartId: `${product.id}-${size}-${Date.now()}-${Math.random()}`,
      };
    });

    setCart((current) => [...current, ...items]);
  };

  const look = looks[view === "single" ? selected : focus];

  useEffect(() => {
    const onKey = (event) => {
      if (activeProduct) {
        if (event.key === "Escape") setActiveProduct(null);
        return;
      }

      if (view !== "single") return;

      if (event.key === "Escape") back();

      if (event.key === "ArrowRight") {
        setSelected((i) => Math.min(looks.length - 1, i + 1));
      }

      if (event.key === "ArrowLeft") {
        setSelected((i) => Math.max(0, i - 1));
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeProduct, view, selected]);

  return (
    <div className="shop">
      <Header
        view={view}
        title={look.name}
        onBack={back}
        count={cart.length}
      />

      {view === "lineup" ? (
        <Lineup
          looks={looks}
          start={focus}
          onPick={pick}
          onFocus={setFocus}
        />
      ) : (
        <SingleLook
          look={look}
          onOpenProduct={setActiveProduct}
        />
      )}

      <ProductPanel
        look={look}
        onOpenProduct={setActiveProduct}
        onAddAll={addAllToCart}
      />

      {activeProduct && (
        <ProductDetail
          product={activeProduct}
          onClose={() => setActiveProduct(null)}
          onAdd={addToCart}
        />
      )}
    </div>
  );
}
