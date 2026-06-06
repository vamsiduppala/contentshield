import { useMemo, useState } from "react";
import { scoreVerdict } from "../../../lib/riskUtils";
import type { Scan } from "../types";

export function useScanFilters(scans: Scan[]) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("Date");

  const filtered = useMemo(() => {
    return scans
      .filter((scan) => scan.title.toLowerCase().includes(query.toLowerCase()))
      .filter((scan) => filter === "All" || scoreVerdict(scan.score) === filter)
      .sort((a, b) => {
        if (sort === "Score") return b.score - a.score;
        if (sort === "Risk Count") return b.riskCount - a.riskCount;
        return +new Date(b.createdAt) - +new Date(a.createdAt);
      });
  }, [filter, query, scans, sort]);

  return { query, setQuery, filter, setFilter, sort, setSort, filtered };
}
