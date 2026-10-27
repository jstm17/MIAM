import { useEffect, useState } from "react";

const FIELD =
  'input:not([type=checkbox]):not([type=radio]):not([type=button]):not([type=submit]), textarea, [contenteditable="true"]';

const TOUCH_DEVICE = "(hover: none) and (pointer: coarse)";

const isField = (el: EventTarget | null) =>
  el instanceof HTMLElement && el.matches(FIELD);

export function useKeyboardOpen() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(TOUCH_DEVICE);

    const onIn = (e: FocusEvent) => {
      if (mq.matches && isField(e.target)) setOpen(true);
    };
    const onOut = (e: FocusEvent) => {
      if (!isField(e.relatedTarget)) setOpen(false); // évite le clignotement entre deux champs
    };
    const onMediaChange = () => {
      if (!mq.matches) setOpen(false); // l'appareil n'est plus considéré comme tactile
    };

    document.addEventListener("focusin", onIn);
    document.addEventListener("focusout", onOut);
    mq.addEventListener("change", onMediaChange);
    return () => {
      document.removeEventListener("focusin", onIn);
      document.removeEventListener("focusout", onOut);
      mq.removeEventListener("change", onMediaChange);
    };
  }, []);

  return open;
}
