"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

interface Props {
  /** Always visible when collapsed on mobile (brand + search). */
  peek: ReactNode;
  /** Revealed when the sheet is dragged up (filters + list). */
  children: ReactNode;
}

/**
 * Desktop: a standalone floating glass card pinned left.
 * Mobile: a draggable bottom sheet — collapsed to the peek (search) by
 * default, drag the handle up to reveal the list, swipe down to collapse.
 */
export function FloatingPanel({ peek, children }: Props) {
  const [isMobile, setIsMobile] = useState(false);
  const [open, setOpen] = useState(false);
  const [maxT, setMaxT] = useState(0);
  const [drag, setDrag] = useState<number | null>(null);

  const sheetRef = useRef<HTMLDivElement>(null);
  const peekRef = useRef<HTMLDivElement>(null);
  const start = useRef<{ y: number; base: number; moved: number } | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useLayoutEffect(() => {
    const measure = () => {
      const sheet = sheetRef.current;
      const peekEl = peekRef.current;
      if (!sheet || !peekEl) return;
      const peekPx = peekEl.offsetTop + peekEl.offsetHeight;
      setMaxT(Math.max(0, sheet.offsetHeight - peekPx));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (sheetRef.current) ro.observe(sheetRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [isMobile]);

  const base = open ? 0 : maxT;
  const translateY = isMobile ? (drag ?? base) : 0;

  function onDown(e: React.PointerEvent) {
    if (!isMobile) return;
    start.current = { y: e.clientY, base, moved: 0 };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }
  function onMove(e: React.PointerEvent) {
    if (!start.current) return;
    const delta = e.clientY - start.current.y;
    start.current.moved = delta;
    setDrag(Math.min(maxT, Math.max(0, start.current.base + delta)));
  }
  function onUp() {
    if (!start.current) return;
    const { moved } = start.current;
    start.current = null;
    setDrag(null);
    if (moved < -30) setOpen(true);
    else if (moved > 30) setOpen(false);
    else setOpen((o) => !o); // tap toggles
  }

  return (
    <div
      ref={sheetRef}
      style={
        isMobile
          ? {
              transform: `translateY(${translateY}px)`,
              transition:
                drag == null
                  ? "transform 0.3s cubic-bezier(0.32,0.72,0,1)"
                  : "none",
            }
          : undefined
      }
      className="fixed inset-x-0 bottom-0 z-[500] flex max-h-[85vh] flex-col overflow-hidden rounded-t-3xl border border-white/60 bg-gradient-to-b from-white/55 to-white/25 shadow-[0_8px_40px_rgba(0,0,0,0.18)] ring-1 ring-white/40 backdrop-blur-2xl backdrop-saturate-200 sm:inset-x-auto sm:bottom-8 sm:left-10 sm:top-8 sm:max-h-none sm:w-[360px] sm:rounded-3xl sm:shadow-2xl"
    >
      {/* drag handle (mobile only) */}
      <div
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        style={{ touchAction: "none" }}
        className="flex shrink-0 cursor-grab justify-center py-2 active:cursor-grabbing sm:hidden"
      >
        <span className="h-1.5 w-10 rounded-full bg-ink/20" />
      </div>

      <div ref={peekRef} className="shrink-0">
        {peek}
      </div>

      {children}
    </div>
  );
}
