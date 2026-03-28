import { useEffect, useRef } from "react";

export default function Cursor() {
  const curRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const rx = useRef(0);
  const ry = useRef(0);
  const mx = useRef(0);
  const my = useRef(0);
  const rafId = useRef<number>(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mx.current = e.clientX;
      my.current = e.clientY;
    };
    document.addEventListener("mousemove", onMove);

    const tick = () => {
      rx.current += (mx.current - rx.current) * 0.12;
      ry.current += (my.current - ry.current) * 0.12;
      if (curRef.current) {
        curRef.current.style.left = `${mx.current}px`;
        curRef.current.style.top  = `${my.current}px`;
      }
      if (ringRef.current) {
        ringRef.current.style.left = `${rx.current}px`;
        ringRef.current.style.top  = `${ry.current}px`;
      }
      rafId.current = requestAnimationFrame(tick);
    };
    rafId.current = requestAnimationFrame(tick);

    const expand = () => {
      if (ringRef.current) {
        ringRef.current.style.width  = "52px";
        ringRef.current.style.height = "52px";
        ringRef.current.style.borderColor = "rgba(126,184,212,0.7)";
      }
      if (curRef.current) {
        curRef.current.style.width  = "5px";
        curRef.current.style.height = "5px";
      }
    };
    const shrink = () => {
      if (ringRef.current) {
        ringRef.current.style.width  = "36px";
        ringRef.current.style.height = "36px";
        ringRef.current.style.borderColor = "rgba(126,184,212,0.4)";
      }
      if (curRef.current) {
        curRef.current.style.width  = "8px";
        curRef.current.style.height = "8px";
      }
    };

    const interactables = document.querySelectorAll("button,a,[data-interactive]");
    interactables.forEach(el => {
      el.addEventListener("mouseenter", expand);
      el.addEventListener("mouseleave", shrink);
    });

    return () => {
      document.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <>
      <div
        ref={curRef}
        style={{
          position: "fixed", width: 8, height: 8, borderRadius: "50%",
          background: "var(--glow)", pointerEvents: "none", zIndex: 9999,
          transform: "translate(-50%,-50%)", mixBlendMode: "screen",
          transition: "width 0.2s, height 0.2s",
        }}
      />
      <div
        ref={ringRef}
        style={{
          position: "fixed", width: 36, height: 36, borderRadius: "50%",
          border: "1px solid rgba(126,184,212,0.4)", pointerEvents: "none", zIndex: 9998,
          transform: "translate(-50%,-50%)",
          transition: "width 0.3s, height 0.3s, border-color 0.3s",
        }}
      />
    </>
  );
}
