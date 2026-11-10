import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";

export function FadeIn({ children, delay = 0, y = 16 }: { children: ReactNode; delay?: number; y?: number }) {
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

export function ScrollReveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const animate = () => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 80) {
        gsap.fromTo(el, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, delay, ease: "power2.out" });
        window.removeEventListener("scroll", animate);
      }
    };
    window.addEventListener("scroll", animate);
    animate();
    return () => window.removeEventListener("scroll", animate);
  }, [delay]);

  return <div ref={ref}>{children}</div>;
}

export function Floating({ children, duration = 4 }: { children: ReactNode; duration?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    gsap.to(ref.current, {
      y: -14,
      duration,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }, [duration]);

  return <div ref={ref}>{children}</div>;
}

export function FloatSlow({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    gsap.to(ref.current, {
      y: -22,
      duration: 5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }, []);

  return <div ref={ref}>{children}</div>;
}