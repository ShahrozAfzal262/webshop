export default function Header({ view, title, onBack, count, onBag }) {
  return <header className="top">
    <a className="wordmark" href="/" aria-label="Form Studio home" onClick={(e) => { e.preventDefault(); onBack(); }}><span className="mark">F.</span><span>FORM <i>STUDIO</i></span></a>
    <div className="top-center">{view === "lineup" ? "A STUDY IN EVERYDAY DRESSING" : <><button className="back" onClick={onBack}>← <span>ALL LOOKS</span></button><span className="current-title">{title}</span></>}</div>
    <button className="cart" onClick={onBag}>BAG <span>({count})</span><i>↗</i></button>
  </header>;
}
