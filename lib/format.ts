import { PotholeStatus } from "./types";

export function timeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const secs = Math.max(1, Math.round((Date.now() - then) / 1000));
  const units: [number, string][] = [
    [60, "s"],
    [60, "m"],
    [24, "h"],
    [7, "d"],
    [4.345, "w"],
    [12, "mo"],
    [Number.POSITIVE_INFINITY, "y"],
  ];
  let val = secs;
  let unit = "s";
  for (const [size, label] of units) {
    if (val < size) {
      unit = label;
      break;
    }
    val = val / size;
    unit = label;
  }
  return `${Math.floor(val)}${unit} ago`;
}

export function compactNumber(n: number): string {
  return Intl.NumberFormat("en", { notation: "compact" }).format(n);
}

export const STATUS_META: Record<
  PotholeStatus,
  { label: string; color: string; chip: string }
> = {
  reported: {
    label: "Reported",
    color: "#ff5a1f",
    chip: "bg-cone/10 text-cone border-cone/30",
  },
  in_progress: {
    label: "On the radar",
    color: "#b45309",
    chip: "bg-amber-100 text-amber-700 border-amber-300",
  },
  filled: {
    label: "Filled ✓",
    color: "#16a34a",
    chip: "bg-emerald-100 text-emerald-700 border-emerald-300",
  },
};
