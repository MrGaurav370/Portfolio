import { useEffect, useRef, useState } from "react";

// Fades an element in the first time it scrolls into view. No-ops with reduced motion.
export default function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  const reduce =
    typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const [visible, setVisible] = useState(reduce || typeof IntersectionObserver === "undefined");

  useEffect(() => {
    if (visible || !ref.current) return undefined;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [visible, threshold]);

  return [ref, visible];
}
