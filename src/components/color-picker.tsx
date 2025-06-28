"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Check, Copy, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import {
  hsvToRgb,
  rgbToHsv,
  rgbToHex,
  hexToRgb,
  isValidHex,
  type RGB,
  type HSV,
} from "@/lib/colors";
import { Label } from "@/components/ui/label";

type ColorPickerProps = {
  color: string;
  onChange: (color: string) => void;
  onClose: () => void;
};

export default function ColorPicker({
  color,
  onChange,
  onClose,
}: ColorPickerProps) {
  const { toast } = useToast();
  const [isCopied, setIsCopied] = useState(false);

  const [hsv, setHsv] = useState<HSV>(() => {
    const initialRgb = hexToRgb(color);
    return initialRgb ? rgbToHsv(initialRgb) : { h: 0, s: 100, v: 100 };
  });

  useEffect(() => {
    if (isValidHex(color)) {
      const currentHex = rgbToHex(hsvToRgb(hsv));
      if (color.toLowerCase() !== currentHex.toLowerCase()) {
        const newRgb = hexToRgb(color);
        if (newRgb) {
          const newHsv = rgbToHsv(newRgb);
          if (newHsv.h !== hsv.h || newHsv.s !== hsv.s || newHsv.v !== hsv.v) {
            setHsv(newHsv);
          }
        }
      }
    }
  }, [color, hsv]);

  const rgb = hsvToRgb(hsv);
  const hex = rgbToHex(rgb);

  const handleHsvChange = useCallback(
    (newHsv: Partial<HSV>) => {
      const updatedHsv = { ...hsv, ...newHsv };
      setHsv(updatedHsv);
      onChange(rgbToHex(hsvToRgb(updatedHsv)));
    },
    [hsv, onChange]
  );

  const handleRgbChange = (newRgb: Partial<RGB>) => {
    const updatedRgb = { ...rgb, ...newRgb };
    const newHsv = rgbToHsv(updatedRgb);
    setHsv(newHsv);
    onChange(rgbToHex(updatedRgb));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(hex.toUpperCase()).then(() => {
      setIsCopied(true);
      toast({
        title: "Color Copied!",
        description: `${hex.toUpperCase()} is now on your clipboard.`,
      });
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const SaturationValuePicker = () => {
    const pickerRef = useRef<HTMLDivElement>(null);

    const handlePickerChange = useCallback(
      (e: MouseEvent | React.MouseEvent) => {
        if (pickerRef.current) {
          const rect = pickerRef.current.getBoundingClientRect();
          let x = e.clientX - rect.left;
          let y = e.clientY - rect.top;
          x = Math.max(0, Math.min(x, rect.width));
          y = Math.max(0, Math.min(y, rect.height));

          const s = (x / rect.width) * 100;
          const v = 100 - (y / rect.height) * 100;
          handleHsvChange({ s, v });
        }
      },
      [handleHsvChange]
    );

    const handleMouseUp = useCallback(() => {
      window.removeEventListener("mousemove", handlePickerChange);
      window.removeEventListener("mouseup", handleMouseUp);
    }, [handlePickerChange]);

    const handleMouseDown = useCallback(
      (e: React.MouseEvent) => {
        handlePickerChange(e);
        window.addEventListener("mousemove", handlePickerChange);
        window.addEventListener("mouseup", handleMouseUp);
      },
      [handlePickerChange, handleMouseUp]
    );

    return (
      <div
        ref={pickerRef}
        className="relative h-48 w-full cursor-crosshair overflow-hidden rounded-t-md"
        style={{ backgroundColor: `hsl(${hsv.h}, 100%, 50%)` }}
        onMouseDown={handleMouseDown}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, #fff, rgba(255,255,255,0))",
          }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to top, #000, rgba(0,0,0,0))" }}
        />
        <div
          className="absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-md"
          style={{
            left: `${hsv.s}%`,
            top: `${100 - hsv.v}%`,
            backgroundColor: hex,
          }}
        />
      </div>
    );
  };

  return (
    <Card className="w-full max-w-xs border-border/20 shadow-2xl">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg font-semibold">Color Picker</CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-8 w-8 rounded-full"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <SaturationValuePicker />
        <div className="space-y-4 px-1">
          <div>
            <Slider
              value={[hsv.h]}
              onValueChange={([h]) => handleHsvChange({ h })}
              max={360}
              step={1}
              className="[&>div>span]:[background:linear-gradient(to_right,#f00,#ff0,#0f0,#0ff,#00f,#f0f,#f00)]"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="r" className="w-4">R</Label>
              <Slider id="r" value={[rgb.r]} onValueChange={([r]) => handleRgbChange({ r })} max={255} step={1} style={{'--slider-bg': `linear-gradient(to right, rgb(0, ${rgb.g}, ${rgb.b}), rgb(255, ${rgb.g}, ${rgb.b}))`} as React.CSSProperties} className="[&>div>span]:[background:var(--slider-bg)]"/>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="g" className="w-4">G</Label>
              <Slider id="g" value={[rgb.g]} onValueChange={([g]) => handleRgbChange({ g })} max={255} step={1} style={{'--slider-bg': `linear-gradient(to right, rgb(${rgb.r}, 0, ${rgb.b}), rgb(${rgb.r}, 255, ${rgb.b}))`} as React.CSSProperties} className="[&>div>span]:[background:var(--slider-bg)]"/>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="b" className="w-4">B</Label>
              <Slider id="b" value={[rgb.b]} onValueChange={([b]) => handleRgbChange({ b })} max={255} step={1} style={{'--slider-bg': `linear-gradient(to right, rgb(${rgb.r}, ${rgb.g}, 0), rgb(${rgb.r}, ${rgb.g}, 255))`} as React.CSSProperties} className="[&>div>span]:[background:var(--slider-bg)]"/>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div
            className="h-10 w-10 rounded-md border"
            style={{ backgroundColor: hex }}
          ></div>
          <Input
            id="hex"
            value={hex.toUpperCase()}
            readOnly
            className="font-mono"
          />
          <Button size="icon" onClick={handleCopy}>
            {isCopied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            <span className="sr-only">Copy HEX code</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
