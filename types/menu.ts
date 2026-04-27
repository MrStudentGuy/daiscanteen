export type RawBreakfast = {
  items?: unknown;
  accompaniments?: unknown;
};

export type RawLunch = {
  salad?: unknown;
  healthy?: unknown;
  vegetable?: unknown;
  dal?: unknown;
  rice?: unknown;
  roti_puri_bread?: unknown;
  fruit_dessert?: unknown;
};

export type RawDailyMenu = {
  breakfast?: RawBreakfast;
  lunch?: RawLunch;
  evening_snacks?: unknown;
};

export type RawMonthlyMenu = Record<string, RawDailyMenu>;

export type LunchFieldKey =
  | "salad"
  | "healthy"
  | "vegetable"
  | "dal"
  | "rice"
  | "roti_puri_bread"
  | "fruit_dessert";

export type NormalizedLunchField = {
  key: LunchFieldKey;
  label: string;
  value: string | null;
};

export type NormalizedDailyMenu = {
  breakfastItems: string[];
  breakfastAccompaniments: string[];
  lunch: NormalizedLunchField[];
  eveningSnacks: string[];
};

export type DailyMenuResult = {
  date: string;
  menu: NormalizedDailyMenu | null;
  hasMonthFile: boolean;
  availableMonthKeys: string[];
};
