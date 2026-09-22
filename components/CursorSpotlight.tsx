"use client";

import { useEffect, useState } from "react";

export default function CursorSpotlight() {
  const [pos, setPos] = useState({ x: -1000, y: -1000 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let animId: number;
    let targetX = -1000;
    let targetY = -1000;
    let curX = -1000;
    let curY = -1000;

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!visible) setVisible(true);
    };

    const handleMouseLeave = () => {
      setVisible(false);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    const updateLoop = () => {
      curX += (targetX - curX) * 0.12;
      curY += (targetY - curY) * 0.12;
      setPos({ x: curX, y: curY });
      animId = requestAnimationFrame(updateLoop);
    };

    animId = requestAnimationFrame(updateLoop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-20 transition-opacity duration-300"
      style={{
        background: `radial-gradient(650px circle at ${pos.x}px ${pos.y}px, rgba(139, 92, 246, 0.12), rgba(56, 189, 248, 0.05) 40%, transparent 80%)`,
      }}
      aria-hidden="true"
    />
  );
}
