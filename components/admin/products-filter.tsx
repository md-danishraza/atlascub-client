"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useGetCategoriesQuery } from "@/lib/store/apis/category-api";

interface ProductsFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  selectedGender: string;
  onGenderChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
  showHidden?: boolean;
  onShowHiddenChange?: (value: boolean) => void;
}

export function ProductsFilters({
  search,
  onSearchChange,
  selectedGender,
  onGenderChange,
  selectedCategory,
  onCategoryChange,
  onClearFilters,
  hasActiveFilters,
  showHidden = true,
  onShowHiddenChange,
}: ProductsFiltersProps) {
  const { data: allCategories } = useGetCategoriesQuery();

  const filteredCategories = allCategories?.filter(
    (cat) => selectedGender === "all" || cat.gender === selectedGender
  );

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Search */}
      <div className="relative w-64">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Gender Filter */}
      <Select value={selectedGender} onValueChange={onGenderChange}>
        <SelectTrigger className="w-32">
          <SelectValue placeholder="All Genders" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Genders</SelectItem>
          <SelectItem value="men">Men</SelectItem>
          <SelectItem value="women">Women</SelectItem>
          <SelectItem value="kids">Kids</SelectItem>
        </SelectContent>
      </Select>

      {/* Category Filter */}
      <Select value={selectedCategory} onValueChange={onCategoryChange}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="All Categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {filteredCategories?.map((cat) => (
            <SelectItem key={cat.id} value={cat.slug}>
              {cat.name} ({cat.gender})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Show Hidden Toggle */}
      {onShowHiddenChange && (
        <div className="flex items-center gap-2">
          <Switch
            id="show-hidden"
            checked={showHidden}
            onCheckedChange={onShowHiddenChange}
          />
          <Label htmlFor="show-hidden" className="text-sm cursor-pointer">
            Show hidden products
          </Label>
        </div>
      )}

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <Button variant="ghost" onClick={onClearFilters} className="gap-2">
          <X className="h-4 w-4" />
          Clear Filters
        </Button>
      )}
    </div>
  );
}