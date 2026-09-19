export interface FontItem {
  family: string;
  category: string; // 'serif' | 'sans-serif' | 'display' | 'handwriting' | 'monospace'
  variants: string[];
  subsets?: string[];
  version?: string;
  lastModified?: string;
  popularity?: number; // Ranking index (lower number = more popular)
  source: 'google' | string;
}

export interface FontCatalogResponse {
  fonts: FontItem[];
  total: number;
  source: string;
}

export interface FontProvider {
  name: string;
  getFonts(): Promise<FontItem[]>;
}
