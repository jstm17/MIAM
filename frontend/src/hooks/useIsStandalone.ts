import { useEffect, useState } from "react";

export const useIsStandalone = () => {
  const [isStandalone, setIsStandalone] = useState(
    window.matchMedia("(display-mode: standalone)").matches,
  );

  useEffect(() => {
    const media = window.matchMedia("(display-mode: standalone)");
    const handler = (e: MediaQueryListEvent) => setIsStandalone(e.matches);
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, []);

  return isStandalone;
};
