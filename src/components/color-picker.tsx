"use client";

import { useState } from "react";
import { Check, Copy, X } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";

type ColorPickerProps = {
  color: string;
  onChange: (color: string) => void;
  onClose: () => void;
};

// A curated list of 24 colors for the swatch
const swatches = [
  '#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3',
  '#03A9F4', '#00BCD4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39',
  '#FFEB3B', '#FFC107', '#FF9800', '#FF5722', '#795548', '#607D8B',
  '#FFFFFF', '#E0E0E0', '#9E9E9E', '#757575', '#424242', '#212121',
];

export default function ColorPicker({
  color,
  onChange,
  onClose,
}: ColorPickerProps) {
  const { toast } = useToast();
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(color).then(() => {
      setIsCopied(true);
      toast({
        title: "Color Copied!",
        description: `${color.toUpperCase()} is now on your clipboard.`,
      });
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

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
        <div className="grid grid-cols-6 gap-3 justify-items-center mb-4">
          {swatches.map((swatch) => (
            <button
              key={swatch}
              onClick={() => onChange(swatch)}
              className={cn(
                "w-9 h-9 rounded-full border transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                swatch.toUpperCase() === color.toUpperCase()
                  ? "ring-2 ring-primary ring-offset-2 ring-offset-background scale-110"
                  : "ring-0",
                swatch === '#FFFFFF' ? 'border-muted' : 'border-transparent'
              )}
              style={{ backgroundColor: swatch }}
              aria-label={`Select color ${swatch}`}
            />
          ))}
        </div>
        
        <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-md border" style={{backgroundColor: color}}></div>
            <Input
                id="hex"
                value={color.toUpperCase()}
                readOnly
                className="font-mono"
              />
            <Button size="icon" onClick={handleCopy}>
              {isCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              <span className="sr-only">Copy HEX code</span>
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}
