import { type ClassValue, clsx } from "clsx"

// Simple utility function that combines and deduplicates classes
// This replaces tailwind-merge with a basic implementation to avoid import issues
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}