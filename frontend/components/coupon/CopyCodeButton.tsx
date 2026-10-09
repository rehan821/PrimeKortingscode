"use client";

import { useEffect, useRef, useState } from "react";
import type { Dictionary } from "@/i18n/dictionary";
import { buttonClass } from "@/components/ui/button";
import { CheckIcon, CopyIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

interface CopyCodeButtonProps {
  code: string;
  dict: Dictionary;
}

/** Copies the revealed code to the clipboard with clear feedback. */
export function CopyCodeButton({ code, dict }: CopyCodeButtonProps) {
  const [state, setState] = useState<"idle" | "copied" | "error">("idle");
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    };
  }, []);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);
      setState("copied");
    } catch {
      setState("error");
    }
    if (resetTimer.current) clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setState("idle"), 3000);
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleCopy}
        className={buttonClass(state === "copied" ? "primary" : "accent", "md", "w-full")}
        aria-live="polite"
      >
        {state === "copied" ? <CheckIcon size={16} /> : <CopyIcon size={16} />}
        {state === "copied" ? dict.buttons.copied : dict.buttons.copyCode}
      </button>
      {state === "error" ? (
        <p className={cn("mt-1.5 text-center text-xs font-medium text-danger-600")} role="alert">
          {dict.buttons.copyFailed}
        </p>
      ) : null}
    </div>
  );
}
