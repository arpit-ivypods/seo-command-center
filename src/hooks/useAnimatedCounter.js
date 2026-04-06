import { useState, useEffect, useRef } from 'react';

export default function useAnimatedCounter(target, duration = 1000, delay = 0) {
  const [value, setValue] = useState(0);
  const animFrameRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    let timeoutId = null;

    const animate = (timestamp) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out cubic for smooth deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);

      setValue(current);

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      }
    };

    const start = () => {
      startTimeRef.current = null;
      animFrameRef.current = requestAnimationFrame(animate);
    };

    if (delay > 0) {
      timeoutId = setTimeout(start, delay);
    } else {
      start();
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [target, duration, delay]);

  return value;
}
