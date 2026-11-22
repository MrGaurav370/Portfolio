import React, { useEffect, useRef } from "react";

const ScrollProgress = () => {
  const bar = useRef(null);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (bar.current) bar.current.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); cancelAnimationFrame(frame); };
  }, []);
  return <div ref={bar} aria-hidden="true" className="fixed top-0 left-0 right-0 h-0.5 z-[60] bg-[#00d9ff] origin-left" style={{ transform: "scaleX(0)" }} />;
};

export default ScrollProgress;
