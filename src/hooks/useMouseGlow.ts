import { useEffect, useState } from "react";

export function useMouseGlow() {
  const [position, setPosition] = useState({ x: 50, y: 20 });

  useEffect(() => {
    const update = (event: MouseEvent) => {
      setPosition({
        x: Math.round((event.clientX / window.innerWidth) * 100),
        y: Math.round((event.clientY / window.innerHeight) * 100)
      });
    };

    window.addEventListener("pointermove", update, { passive: true });
    return () => window.removeEventListener("pointermove", update);
  }, []);

  return position;
}
