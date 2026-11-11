export default function SingleLook({ look, onOpenProduct }) {
  const spots = look.hotspots || [{ x: 50, y: 30, p: 0 }, { x: 50, y: 66, p: 1 }];
  return (
    <div className="single" key={look.id}>
      <div className="figure">
        <img src={look.image} alt={`${look.name} outfit`} draggable="false" />
        {spots.map((h, i) => {
          const p = look.products[h.p];
          return (
            <button
              key={i}
              className="spot"
              style={{ left: `${h.x}%`, top: `${h.y}%` }}
              aria-label={`View ${p.name}`}
              onClick={() => onOpenProduct(p)}
            >
              <i />
            </button>
          );
        })}
      </div>
    </div>
  );
}
