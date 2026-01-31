import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatElapsedTime(startTimestamp: number): string {
  const now = Date.now();
  const elapsed = Math.floor((now - startTimestamp) / 1000);

  const hours = Math.floor(elapsed / 3600);
  const minutes = Math.floor((elapsed % 3600) / 60);
  const seconds = elapsed % 60;

  if (hours > 0) {
    return `${String(hours)}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }
  return `${String(minutes)}:${seconds.toString().padStart(2, "0")}`;
}

export function formatRemainingTime(endTimestamp: number): string {
  const now = Date.now();
  const remaining = Math.max(0, Math.floor((endTimestamp - now) / 1000));

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;

  return `${String(minutes)}:${seconds.toString().padStart(2, "0")}`;
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
