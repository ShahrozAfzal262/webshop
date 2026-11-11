export default function Header({ view, title, onBack, count }) {
  return (
    <header className="top">
      {view === "lineup" ? (
        <div>
          <span className="brand">FORM / STUDIO</span>
          <h1>Dress like <em>you mean it.</em></h1>
          <p>Swipe left to explore our curated looks</p>
        </div>
      ) : (
        <div>
          <button className="back" onClick={onBack}>← All looks</button>
          <span className="brand">FORM / STUDIO</span>
          <h1 className="look-title">{title}</h1>
        </div>
      )}
      <span className="cart">Bag <b>{String(count).padStart(2, "0")}</b></span>
    </header>
  );
}
