"use client";

import { useState } from "react";
import { X, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Color {
  name: string;
  value: string;
}

interface ColorPickerProps {
  colors: Color[];
  onChange: (colors: Color[]) => void;
  error?: string;
}

export function ColorPicker({ colors, onChange, error }: ColorPickerProps) {
  const [colorName, setColorName] = useState("");
  const [colorValue, setColorValue] = useState("#000000");

  const addColor = () => {
    if (colorName && colorValue && !colors.find((c) => c.name === colorName)) {
      onChange([...colors, { name: colorName, value: colorValue }]);
      setColorName("");
      setColorValue("#000000");
    }
  };

  const removeColor = (colorName: string) => {
    onChange(colors.filter((c) => c.name !== colorName));
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">Colors *</label>
      
      <div className="flex flex-wrap gap-3">
        {colors.map((color) => (
          <div
            key={color.name}
            className="flex items-center gap-2 rounded-md border border-border px-3 py-1"
          >
            <div
              className="h-5 w-5 rounded-full border border-border"
              style={{ backgroundColor: color.value }}
            />
            <span className="text-sm">{color.name}</span>
            <button
              type="button"
              onClick={() => removeColor(color.name)}
              className="text-muted-foreground hover:text-destructive"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Color name (e.g., Black)"
          value={colorName}
          onChange={(e) => setColorName(e.target.value)}
          className="flex-1"
        />
        <Input
          type="color"
          value={colorValue}
          onChange={(e) => setColorValue(e.target.value)}
          className="w-16"
        />
        <Button type="button" onClick={addColor} size="icon">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}