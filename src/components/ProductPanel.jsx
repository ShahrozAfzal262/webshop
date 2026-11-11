
import { getSizes, getSizePrice } from "../data/looks";

export default function ProductPanel({ look, onOpenProduct, onAddAll }) {
  const total = look.products.reduce((sum, product) => {
    const defaultSize = getSizes(product)[1];
    return sum + getSizePrice(product, defaultSize);
  }, 0);

  return (
    <>
      <aside className="panel" key={look.id}>
        <div className="panel-heading">
          <p className="in-look">The edit</p>
          <span>
            {String(look.products.length).padStart(2, "0")} pieces
          </span>
        </div>

        <ul>
          {look.products.map((product) => (
            <li key={product.id}>
              <button
                className="product-row"
                onClick={() => onOpenProduct(product)}
                aria-label={`View ${product.name}`}
              >
                <img
                  className="thumb"
                  src={product.image}
                  alt=""
                  draggable="false"
                />

                <span className="info">
                  <span className="ptype">{product.type}</span>
                  <span className="pname">{product.name}</span>
                  <span className="price">
                    ${product.price.toFixed(2)}
                  </span>
                </span>

                <span className="product-arrow" aria-hidden="true">
                  ↗
                </span>
              </button>
            </li>
          ))}
        </ul>

        <p className="panel-hint">
          Select a piece to see the details
        </p>
      </aside>

      <button
        className="bag"
        onClick={() => onAddAll(look.products)}
        aria-label={`Add full look to bag for $${total}`}
      >
        Add the look
        <span>${total.toFixed(2)}</span>
        <b aria-hidden="true">↗</b>
      </button>
    </>
  );
}
