"use client";

import { useState, useEffect, useCallback } from "react";
import { Palette, Maximize, Minimize } from "lucide-react";
import ColorPicker from "@/components/color-picker";
import { Button } from "@/components/ui/button";
import { isValidHex } from "@/lib/colors";
import { cn } from "@/lib/utils";

const DEFAULT_COLOR = "#2962FF";

export default function Home() {
  const [color, _setColor] = useState(DEFAULT_COLOR);
  const [isPickerVisible, setIsPickerVisible] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Memoized setColor to prevent re-creating the function on every render
  const setColor = useCallback((newColor: string, replaceHistory = false) => {
    _setColor(newColor);
    const historyMethod = replaceHistory ? "replaceState" : "pushState";
    window.history[historyMethod](null, "", newColor);
  }, []);

  // Effect to handle URL changes (initial load, back/forward buttons)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (isValidHex(hash)) {
        _setColor(hash);
      } else {
        // Fallback to default if hash is invalid or empty
        _setColor(DEFAULT_COLOR);
      }
    };

    handleHashChange(); // Sync on initial load

    window.addEventListener("hashchange", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(
          `Error attempting to enable full-screen mode: ${err.message} (${err.name})`
        );
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", onFullscreenChange);

    // Initial check in case the app loads in fullscreen
    setIsFullscreen(!!document.fullscreenElement);

    return () =>
      document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  return (
    <main
      className="h-svh w-full transition-colors duration-500 ease-in-out"
      style={{ backgroundColor: color }}
    >
      <div className="relative h-full w-full">
        <div className="absolute bottom-4 left-4">
          <Button
            size="icon"
            onClick={toggleFullscreen}
            className="rounded-full h-14 w-14 shadow-lg"
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? (
              <Minimize className="h-6 w-6" />
            ) : (
              <Maximize className="h-6 w-6" />
            )}
          </Button>
        </div>

        <div
          className={cn(
            "absolute bottom-4 right-4 transition-all duration-300",
            isPickerVisible
              ? "opacity-0 translate-y-4 pointer-events-none"
              : "opacity-100 translate-y-0"
          )}
        >
          <Button
            size="icon"
            onClick={() => setIsPickerVisible(true)}
            className="rounded-full h-14 w-14 shadow-lg"
            aria-label="Show color picker"
          >
            <Palette className="h-6 w-6" />
          </Button>
        </div>

        <div
          className={cn(
            "absolute inset-x-0 bottom-0 p-4 transition-all duration-300 ease-in-out flex justify-center",
            isPickerVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-full pointer-events-none"
          )}
        >
          <ColorPicker
            color={color}
            onChange={(newColor) => setColor(newColor, true)}
            onClose={() => setIsPickerVisible(false)}
          />
        </div>
      </div>
    </main>
  );
}
