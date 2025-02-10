import { LayoutOption, MarginOption } from './types';

export const placeholderRegex = /\{([\u0400-\u04FF\u0800-\u083F\u0900-\u097F\uA000-\uA48F\uA800-\uA82F\uAC00-\uD7AF\uF900-\uFAFF\w\s]+),([\u0400-\u04FF\u0800-\u083F\u0900-\u097F\uA000-\uA48F\uA800-\uA82F\uAC00-\uD7AF\uF900-\uFAFF\w\s]+)\}/g;

export const predefinedLayouts: LayoutOption[] = [
    {
      key: "A4",
      label: "A4 (210mm × 297mm)",
      // Approximate pixels
      width: 794, 
      height: 1123, 
    },
    {
      key: "Letter",
      label: "Letter (8.5in × 11in)",
      // Approximate pixels
      width: 816, 
      height: 1056, 
    },
];

export const predefinedMargins: MarginOption[] = [
    {
        key: "Normal",
        label: "Normal (1 inch)",
        top: 96,  
        bottom: 96,
        left: 96,
        right: 96,
    },
    {
        key: "Narrow",
        label: "Narrow (0.5 inch)",
        top: 48,
        bottom: 48,
        left: 48,
        right: 48,
    },
    {
        key: "Moderate",
        label: "Moderate (1 inch top/bottom, 0.75 inch left/right)",
        top: 96,
        bottom: 96,
        left: 72,  
        right: 72,
    },
    {
        key: "Wide",
        label: "Wide (1 inch top/bottom, 2 inches left/right)",
        top: 96,
        bottom: 96,
        left: 192,  
        right: 192,
    },
];