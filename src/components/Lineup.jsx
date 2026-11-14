
import { useEffect, useRef } from "react";

const mod = (value, length) =>
  ((value % length) + length) % length;

export default function Lineup({ looks, start, onPick, onFocus }) {
  const wrap = useRef(null);
  const strip = useRef(null);

  const state = useRef({
    angle: start,
    targetAngle: start,
    velocity: 0,
    down: false,
    moved: false,
    startX: 0,
    lastX: 0,
    clickedIndex: null,
    focus: start,
    centerX: 0,
    centerY: 0,
    radiusX: 0,
    radiusY: 0,
    cardWidth: 0,
    cardHeight: 0,
    step: (Math.PI * 2) / Math.max(looks.length, 1),
  });

  useEffect(() => {
    const element = wrap.current;
    const gallery = state.current;

    if (!element || !strip.current || !looks.length) return;

    gallery.angle = mod(start, looks.length);
    gallery.targetAngle = gallery.angle;
    gallery.velocity = 0;
    gallery.step = (Math.PI * 2) / looks.length;

    let raf;

    const updateSize = () => {
      const mobile = element.clientWidth <= 700;

      const panelWidth = Math.min(
        330,
        element.clientWidth * 0.29
      );

      const galleryWidth = mobile
        ? element.clientWidth - 24
        : element.clientWidth * 0.95 - panelWidth - 24;

      const slot = Math.max(
        12,
        galleryWidth / (mobile ? 2.6 : 2.8)
      );

      gallery.cardWidth = Math.min(
        slot * (mobile ? 0.86 : 0.82),
        mobile ? 145 : 220
      );

      gallery.cardHeight = Math.min(
        gallery.cardWidth * (14 / 9),
        element.clientHeight * (mobile ? 0.52 : 0.48),
        mobile ? 260 : 340
      );

      gallery.centerX = mobile
        ? element.clientWidth / 2
        : galleryWidth / 2;

      gallery.centerY = element.clientHeight * 0.58;

      gallery.radiusX = Math.max(
        100,
        Math.min(
          galleryWidth * 0.40,
          element.clientWidth * (mobile ? 0.40 : 0.37)
        )
      );

      gallery.radiusY = Math.max(
        55,
        Math.min(
          element.clientHeight * (mobile ? 0.14 : 0.16),
          element.clientHeight * 0.18
        )
      );
    };

    // Mouse wheel and touchpad movement
    const handleWheel = (event) => {
      event.preventDefault();

      let movement =
        Math.abs(event.deltaX) > Math.abs(event.deltaY)
          ? event.deltaX
          : event.deltaY;

      if (event.deltaMode === 1) movement *= 16;
      if (event.deltaMode === 2) movement *= element.clientWidth;

      if (movement <= 0) return;

      gallery.targetAngle += movement / 900;
      gallery.velocity = 0;
    };

    // Start dragging
    const down = (event) => {
      if (event.button !== 0) return;

      if (
        event.type === "pointerdown" &&
        event.pointerType === "mouse"
      ) return;

      gallery.down = true;
      gallery.moved = false;
      gallery.velocity = 0;

      gallery.startX = event.clientX;
      gallery.lastX = event.clientX;

      const card = event.target.closest("[data-look-index]");

      gallery.clickedIndex = card
        ? Number(card.dataset.lookIndex)
        : null;

      if (event.pointerId !== undefined) {
        element.setPointerCapture(event.pointerId);
      }
    };

    // Drag movement
    const move = (event) => {
      if (
        event.type === "pointermove" &&
        event.pointerType === "mouse"
      ) return;

      if (!gallery.down) return;

      const difference = event.clientX - gallery.lastX;
      gallery.lastX = event.clientX;

      const movement = -difference / 900;
      gallery.targetAngle += movement;
      gallery.velocity = movement * 0.65;

      if (Math.abs(event.clientX - gallery.startX) > 6) {
        gallery.moved = true;
      }
    };

    // Stop dragging and select image
    const up = (event) => {
      if (
        event.type === "pointerup" &&
        event.pointerType === "mouse"
      ) return;

      if (!gallery.down) return;

      if (event.type === "pointercancel") {
        gallery.clickedIndex = null;
        gallery.moved = true;
        gallery.velocity = 0;
      }

      gallery.down = false;

      if (!gallery.moved && gallery.clickedIndex !== null) {
        onPick(gallery.clickedIndex);
      } else if (gallery.moved) {
        gallery.targetAngle = Math.round(
          gallery.targetAngle + gallery.velocity / (1 - 0.90)
        );
        gallery.velocity = 0;
      }
    };

    updateSize();

    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(element);

    element.addEventListener("wheel", handleWheel, {
      passive: false,
    });

    element.addEventListener("pointerdown", down);
    element.addEventListener("mousedown", down);

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);

    // Smooth circular animation
    const tick = () => {
      if (!gallery.down && gallery.velocity > 0.0001) {
        gallery.targetAngle += gallery.velocity;
        gallery.velocity *= 0.90;
      } else if (!gallery.down) {
        gallery.velocity = 0;
      }

      const difference = gallery.targetAngle - gallery.angle;

      gallery.angle += difference * 0.12;

      if (Math.abs(difference) < 0.0001) {
        gallery.angle = gallery.targetAngle;
      }

      // Continuous circular loop
      const visibleAngle = mod(gallery.angle, looks.length);

      Array.from(strip.current.children).forEach((card, index) => {
        const angle = (index - visibleAngle) * gallery.step;

        const front = Math.cos(angle);
        const depth = (front + 1) / 2;

        const x =
          gallery.centerX +
          Math.sin(angle) * gallery.radiusX;

        const y =
          gallery.centerY +
          Math.cos(angle) * gallery.radiusY;

        const scale = 0.76 + depth * 0.24;

        // Smooth image position
        card.style.left = `${x}px`;
        card.style.top = `${y}px`;
        card.style.width = `${gallery.cardWidth}px`;
        card.style.height = `${gallery.cardHeight}px`;

        // Smooth fade transition
        const opacity = Math.max(
          0,
          Math.min(1, (front + 0.12) / 0.55)
        );

        card.style.opacity = `${opacity}`;

        card.style.visibility = opacity > 0.01
          ? "visible"
          : "hidden";

        card.style.pointerEvents = opacity > 0.65
          ? "auto"
          : "none";

        card.style.zIndex = `${Math.round(1 + depth * 10)}`;

        card.style.transform = `
          translate(-50%, -50%)
          scale(${scale})
          rotate(${Math.sin(angle) * 3}deg)
        `;
      });

      // Update focused look
      const focus = mod(
        Math.round(visibleAngle),
        looks.length
      );

      if (focus !== gallery.focus) {
        gallery.focus = focus;
        onFocus(focus);
      }

      raf = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();

      element.removeEventListener("wheel", handleWheel);
      element.removeEventListener("pointerdown", down);
      element.removeEventListener("mousedown", down);

      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
  }, [looks, start, onPick, onFocus]);

  return (
    <div
      className="lineup"
      ref={wrap}
      aria-label="Right to left circular gallery"
    >
      <div className="strip" ref={strip}>
        {looks.map((look, index) => (
          <button
            key={look.id}
            className="item"
            type="button"
            data-look-index={index}
            aria-label={`View ${look.name}`}
          >
            <img
              src={look.image}
              alt={look.name}
              draggable="false"
              loading="eager"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
