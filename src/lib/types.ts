export type Category =
  | "食品"
  | "家電"
  | "コスメ"
  | "旅行"
  | "ギフト券"
  | "ゲーム"
  | "その他";

export const ALL_CATEGORIES: Category[] = [
  "食品",
  "家電",
  "コスメ",
  "旅行",
  "ギフト券",
  "ゲーム",
  "その他",
];

export interface Kensho {
  id: string;
  title: string;
  description: string;
  category: Category;
  deadline: string;
  imageUrl: string;
  url: string;
  sponsor: string;
  prize: string;
  entryMethod: string;
  createdAt: string;
}
