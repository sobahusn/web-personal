import { useEffect, useState } from "react";
import { api } from "../../lib/api";

export interface Taxonomy {
  categories: string[];
  tags: string[];
  series: string[];
  /** Every existing slug, for collision checks */
  slugs: string[];
}

const EMPTY: Taxonomy = { categories: [], tags: [], series: [], slugs: [] };

/** Most-used first, then alphabetical; case-insensitive duplicates merged under their first spelling. */
function rank(values: string[]): string[] {
  const counts = new Map<string, { label: string; n: number }>();
  for (const v of values.map((x) => x.trim()).filter(Boolean)) {
    const entry = counts.get(v.toLowerCase());
    if (entry) entry.n++;
    else counts.set(v.toLowerCase(), { label: v, n: 1 });
  }
  return [...counts.values()]
    .sort((a, b) => b.n - a.n || a.label.localeCompare(b.label))
    .map((e) => e.label);
}

/** Suggestions for category/tag/series fields, derived from existing articles. Failure just means no suggestions. */
export function useTaxonomy(): Taxonomy {
  const [taxonomy, setTaxonomy] = useState<Taxonomy>(EMPTY);

  useEffect(() => {
    const controller = new AbortController();
    api
      .listPosts(true, controller.signal)
      .then((posts) =>
        setTaxonomy({
          categories: rank(posts.map((p) => p.category)),
          tags: rank(posts.flatMap((p) => p.tags)),
          series: rank(posts.map((p) => p.series)),
          slugs: posts.map((p) => p.slug),
        }),
      )
      .catch(() => {});
    return () => controller.abort();
  }, []);

  return taxonomy;
}
