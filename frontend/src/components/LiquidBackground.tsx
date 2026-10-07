"use client";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect } from "react";

export function LiquidBackground() {
  const x = useMotionValue(0), y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 40, damping: 30 }), sy = useSpring(y, { stiffness: 40, damping: 30 });
  useEffect(() => { const fn = (e: MouseEvent) => { x.set((e.clientX / window.innerWidth - .5) * 20); y.set((e.clientY / window.innerHeight - .5) * 20); }; window.addEventListener("mousemove", fn); return () => window.removeEventListener("mousemove", fn); }, [x,y]);
  return <>
    <div className="fixed inset-0 z-0 overflow-hidden bg-[var(--background)] pointer-events-none"><motion.div style={{ x:sx, y:sy }} className="absolute inset-[-30px]"><div className="blob blob-a"/><div className="blob blob-b"/><div className="blob blob-c"/><div className="absolute inset-0 opacity-[.08]" style={{ backgroundImage:"linear-gradient(var(--foreground) 1px, transparent 1px),linear-gradient(90deg,var(--foreground) 1px,transparent 1px)", backgroundSize:"80px 80px" }} />
    </motion.div></div>
    <div className="liquid-cubes-overlay" aria-hidden="true">
      {Array.from({ length: 12 }, (_, index) => (
        <span className="liquid-cube" key={index} style={{ animationDelay: `${index * -1.8}s` }}>
          <span className="cube-face cube-front" />
          <span className="cube-face cube-right" />
          <span className="cube-face cube-top" />
        </span>
      ))}
    </div>
  </>;
}
