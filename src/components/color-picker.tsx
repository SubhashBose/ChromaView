"use client";

import { useState } from "react";
import { HexColorPicker } from "react-colorful";
import { Check, Copy, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

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

  const handleCopy = () => {
    navigator.clipboard.writeText(color.toUpperCase()).then(() => {
      setIsCopied(true);
      toast({
        title: "Color Copied!",
        description: `${color.toUpperCase()} is now on your clipboard.`,
      });
      setTimeout(() => setIsCopied(false), 2000);
    });
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
        <HexColorPicker color={color} onChange={onChange} className="!w-full" />
        
        <div className="flex items-center gap-2">
          <div
            className="h-10 w-10 rounded-md border"
            style={{ backgroundColor: color }}
          ></div>
          <Input
            id="hex"
            value={color.toUpperCase()}
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
