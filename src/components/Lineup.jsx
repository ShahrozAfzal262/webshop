import { useEffect, useRef } from "react";

export default function Lineup({ looks, start, onPick, onFocus }) {
  const wrap = useRef(null);
  const strip = useRef(null);
  const state = useRef({ x: 0, v: 0, down: false, moved: false, last: 0, from: 0, slot: 220, focus: -1, pointerId: null });

  useEffect(() => {
    const w = wrap.current, st = state.current;
    if (!w || !strip.current) return;
    const measure = () => {
      st.slot = Math.max(82, Math.min(w.clientWidth * (w.clientWidth < 600 ? 0.235 : 0.205), w.clientHeight * 0.38));
      st.x = w.clientWidth * 0.47 - (start + 0.5) * st.slot;
    };
    measure();
    let raf = 0;
    const bounds = () => { const center = w.clientWidth * 0.47; return [center - (looks.length - 0.5) * st.slot, center - st.slot / 2]; };
    const tick = () => {
      if (!st.down) {
        st.x += st.v; st.v *= 0.925;
        const [min, max] = bounds();
        if (st.x < min) { st.x += (min - st.x) * 0.16; st.v *= 0.72; }
        if (st.x > max) { st.x += (max - st.x) * 0.16; st.v *= 0.72; }
        if (Math.abs(st.v) < 0.08) st.v = 0;
      }
      const center = w.clientWidth * 0.47;
      let nearest = 0, nearestDistance = Infinity;
      [...strip.current.children].forEach((el, i) => {
        const distance = Math.abs(st.x + (i + 0.5) * st.slot - center);
        if (distance < nearestDistance) { nearestDistance = distance; nearest = i; }
        const normalized = Math.min(distance / (w.clientWidth * 0.54), 1);
        el.style.left = `${(i + 0.5) * st.slot}px`;
        el.style.width = `${st.slot}px`;
        el.style.transform = `translate3d(-50%,0,0) scale(${1.08 - normalized * 0.28})`;
        el.style.opacity = `${1 - normalized * 0.3}`;
        el.style.filter = `blur(${Math.min(Math.abs(st.v) * 0.045, 1.4)}px)`;
        el.classList.toggle("is-center", i === nearest);
      });
      [...strip.current.children].forEach((el, i) => el.classList.toggle("is-center", i === nearest));
      strip.current.style.transform = `translate3d(${st.x}px,0,0)`;
      if (nearest !== st.focus) { st.focus = nearest; onFocus(nearest); }
      raf = requestAnimationFrame(tick);
    };
    tick(); window.addEventListener("resize", measure);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", measure); };
  }, [looks.length]);

  const down = (e) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const st = state.current; st.down = true; st.moved = false; st.v = 0; st.last = st.from = e.clientX; st.pointerId = e.pointerId;
    wrap.current.setPointerCapture(e.pointerId);
  };
  const move = (e) => {
    const st = state.current; if (!st.down || st.pointerId !== e.pointerId) return;
    const dx = e.clientX - st.last; st.last = e.clientX; st.x += dx; st.v = dx;
    if (Math.abs(e.clientX - st.from) > 7) st.moved = true;
  };
  const up = (e) => {
    const st = state.current; if (!st.down) return; st.down = false; st.pointerId = null;
    if (st.moved) return;
    const rect = wrap.current.getBoundingClientRect();
    const index = Math.floor((e.clientX - rect.left - st.x) / st.slot);
    if (index >= 0 && index < looks.length) onPick(index);
  };
  return <section className="lineup" ref={wrap} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onWheel={(e) => { state.current.v -= (e.deltaX || e.deltaY) * 0.055; }} aria-label="Explore looks">
    <div className="strip" ref={strip}>{looks.map((look, index) => <button key={look.id} className="look-card" type="button" aria-label={`Open ${look.name}`}>
      <span className="look-index">0{index + 1}</span><img className="item" src={look.image} alt={look.name} draggable="false" /><span className="look-caption">{look.name}<i>↗</i></span>
    </button>)}</div>
    <div className="drag-hint"><span /> DRAG OR SWIPE TO EXPLORE <span /></div>
  </section>;
}
