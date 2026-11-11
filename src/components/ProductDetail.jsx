
import { useState } from "react";
import { getSizes, getSizePrice } from "../data/looks";

export default function ProductDetail({ product, onClose, onAdd }) {
  const sizes = getSizes(product);
  const [size, setSize] = useState(sizes[1]);
  const currentPrice = getSizePrice(product, size);

  return (
    <div
      className="product-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="product-detail"
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-title"
      >
        <button
          className="detail-close"
          onClick={onClose}
          aria-label="Close product details"
        >
          ×
        </button>

        <div className="detail-image-wrap">
          <img
            src={product.image}
            alt={product.name}
            className="detail-image"
          />
        </div>

        <div className="detail-info">
          <p className="detail-type">
            {product.type} · Studio collection
          </p>

          <h2 id="product-title">{product.name}</h2>

          <p className="detail-price">
            ${currentPrice.toFixed(2)}
          </p>

          <p className="detail-description">
            An easy-to-wear essential, selected to complete the{" "}
            {product.type.toLowerCase()} look.
          </p>

          <p className="size-label">Choose your size</p>

          <div className="size-options" role="group">
            {sizes.map((option) => (
              <button
                key={option}
                className={
                  size === option
                    ? "size-option selected"
                    : "size-option"
                }
                onClick={() => setSize(option)}
                aria-pressed={size === option}
              >
                {option}
              </button>
            ))}
          </div>

          <button
            className="detail-add"
            onClick={() =>
              onAdd({
                ...product,
                size,
                price: currentPrice,
                basePrice: product.price,
                cartId: `${product.id}-${size}-${Date.now()}`,
              })
            }
          >
            Add to bag
            <span>${currentPrice.toFixed(2)}</span>
          </button>

          <button className="detail-back" onClick={onClose}>
            Continue exploring
          </button>
        </div>
      </section>
    </div>
  );
}
