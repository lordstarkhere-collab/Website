import { useLocation } from "react-router-dom";
import { segmentLabels } from "@/shared/config/routes";

export type Crumb = { label: string; to?: string };

/* Auto-generates breadcrumb trail from the current pathname using the
   segment label registry. Pass `overrides` to replace the label of the
   final (or any) segment with a dynamic value (e.g. a tournament name). */
export function useBreadcrumbs(overrides: Record<string, string> = {}): Crumb[] {
  const { pathname } = useLocation();
  const segments = pathname.split("/").filter(Boolean);

  const crumbs: Crumb[] = [{ label: "Home", to: "/" }];
  let acc = "";
  segments.forEach((seg, i) => {
    acc += `/${seg}`;
    const isLast = i === segments.length - 1;
    const label =
      overrides[seg] ??
      segmentLabels[seg] ??
      seg.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    crumbs.push({ label, to: isLast ? undefined : acc });
  });
  return crumbs;
}
