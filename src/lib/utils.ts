import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function formatCost(low: number | null, high: number | null): string {
  if (low == null && high == null) return "—";
  if ((low === 0 || low == null) && (high === 0 || high == null)) return "Free";
  if (low != null && high != null && low !== high) return `$${low}–$${high}`;
  return `$${low ?? high}`;
}

export function formatDate(iso: string): string {
  // iso is a yyyy-mm-dd date string; render without timezone drift
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}
