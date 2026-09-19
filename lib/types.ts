export interface FrameworkData {
  brand: {
    name: string;
    projectName: string;
    year: number | string | undefined;
    logoImage?: string;
  };
  colors: {
    primary: string;
    secondary: string;
    accentColorCount?: 1 | 2 | 3;
    accentColors: string[];
    accent?: string;
  };
  typography: {
    display: string;
    secondary: string;
    tertiary: string;
    caption: string;
  };
  editing: {
    pacing: number | null;
    styles: string[];
  };
  wardrobe: {
    tone: string[];
    colors: string[];
    images: string[];
  };
  background: {
    tone: string[];
    locations: string[];
    images: string[];
  };
}

export type StepNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export const INITIAL_FRAMEWORK_DATA: FrameworkData = {
  brand: {
    name: "",
    projectName: "",
    year: "",
    logoImage: "",
  },
  colors: {
    primary: "",
    secondary: "",
    accentColorCount: 1,
    accentColors: [],
    accent: "",
  },
  typography: {
    display: "",
    secondary: "",
    tertiary: "",
    caption: "",
  },
  editing: {
    pacing: 75,
    styles: [],
  },
  wardrobe: {
    tone: [],
    colors: [],
    images: [],
  },
  background: {
    tone: [],
    locations: [],
    images: [],
  },
};
