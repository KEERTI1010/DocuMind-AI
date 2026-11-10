import { useEffect, type ReactNode, useRef } from "react";
import { gsap } from "gsap";

export default function FadeIn({ children, delay = 0, y = 16 }: { children: ReactNode; delay?: number; y?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    gsap.fromTo(
      ref.current,
      { opacity: 0, y },
      { opacity: 1, y: 0, duration: 0.5, delay, ease: "power2.out" }
    );
  }, [delay, y]);

  return <div ref={ref}>{children}</div>;
}