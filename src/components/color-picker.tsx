"use client";

import { useState, useEffect, useMemo } from "react";
import { Check, Copy, X } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import * as colorUtils from "@/lib/colors";

type ColorPickerProps = {
  color: string;
  onChange: (color: string) => void;
  onClose: () => void;
};

type ColorFormats = {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
};

export default function ColorPicker({
  color,
  onChange,
  onClose,
}: ColorPickerProps) {
  const { toast } = useToast();
  const [isCopied, setIsCopied] = useState(false);
  const [internalColor, setInternalColor] = useState<ColorFormats>(
    colorUtils.convertHex(color)
  );

  useEffect(() => {
    if (colorUtils.isValidHex(color)) {
      setInternalColor(colorUtils.convertHex(color));
    }
  }, [color]);

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (!value.startsWith("#")) {
      value = `#${value}`;
    }
    setInternalColor((prev) => ({ ...prev, hex: value }));
    if (colorUtils.isValidHex(value)) {
      onChange(value);
    }
  };

  const handleRgbChange = (channel: 'r' | 'g' | 'b', value: number) => {
    const newRgb = { ...internalColor.rgb, [channel]: value };
    const newHex = colorUtils.rgbToHex(newRgb);
    onChange(newHex);
  };

  const handleHslChange = (channel: 'h' | 's' | 'l', value: number) => {
    const newHsl = { ...internalColor.hsl, [channel]: value };
    const newHex = colorUtils.hslToHex(newHsl);
    onChange(newHex);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(internalColor.hex).then(() => {
      setIsCopied(true);
      toast({
        title: "Color Copied!",
        description: `${internalColor.hex} is now on your clipboard.`,
      });
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const { r, g, b } = internalColor.rgb;
  const { h, s, l } = internalColor.hsl;

  return (
    <Card className="w-full max-w-sm shadow-2xl border-border/20">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">ChromaLink</CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 rounded-full">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="hex" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="hex">HEX</TabsTrigger>
            <TabsTrigger value="rgb">RGB</TabsTrigger>
            <TabsTrigger value="hsl">HSL</TabsTrigger>
          </TabsList>
          <TabsContent value="hex" className="pt-4">
            <div className="flex items-center gap-2">
              <Input
                id="hex"
                value={internalColor.hex}
                onChange={handleHexChange}
                className="font-mono uppercase"
              />
              <Button size="icon" onClick={handleCopy}>
                {isCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                <span className="sr-only">Copy HEX code</span>
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="rgb" className="pt-2">
            <div className="space-y-4">
              <div className="grid gap-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="r">Red</Label>
                  <span className="text-sm font-mono text-muted-foreground">{r}</span>
                </div>
                <Slider id="r" value={[r]} max={255} step={1} onValueChange={([val]) => handleRgbChange('r', val)} />
              </div>
              <div className="grid gap-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="g">Green</Label>
                   <span className="text-sm font-mono text-muted-foreground">{g}</span>
                </div>
                <Slider id="g" value={[g]} max={255} step={1} onValueChange={([val]) => handleRgbChange('g', val)} />
              </div>
              <div className="grid gap-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="b">Blue</Label>
                   <span className="text-sm font-mono text-muted-foreground">{b}</span>
                </div>
                <Slider id="b" value={[b]} max={255} step={1} onValueChange={([val]) => handleRgbChange('b', val)} />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="hsl" className="pt-2">
            <div className="space-y-4">
              <div className="grid gap-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="h">Hue</Label>
                   <span className="text-sm font-mono text-muted-foreground">{h}</span>
                </div>
                <Slider id="h" value={[h]} max={360} step={1} onValueChange={([val]) => handleHslChange('h', val)} />
              </div>
              <div className="grid gap-2">
                 <div className="flex justify-between items-center">
                  <Label htmlFor="s">Saturation</Label>
                   <span className="text-sm font-mono text-muted-foreground">{s}%</span>
                </div>
                <Slider id="s" value={[s]} max={100} step={1} onValueChange={([val]) => handleHslChange('s', val)} />
              </div>
              <div className="grid gap-2">
                 <div className="flex justify-between items-center">
                  <Label htmlFor="l">Lightness</Label>
                   <span className="text-sm font-mono text-muted-foreground">{l}%</span>
                </div>
                <Slider id="l" value={[l]} max={100} step={1} onValueChange={([val]) => handleHslChange('l', val)} />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
