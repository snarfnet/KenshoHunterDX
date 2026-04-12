import kenshoData from "@/data/kensho.json";
import type { Kensho, Category } from "./types";

const allKensho: Kensho[] = kenshoData as Kensho[];

/**
 * 締切切れを除いた懸賞一覧を返す
 */
export function getActiveKensho(): Kensho[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return allKensho.filter((k) => {
    const deadline = new Date(k.deadline);
    deadline.setHours(23, 59, 59, 999);
    return deadline >= today;
  });
}

export function getKenshoById(id: string): Kensho | undefined {
  return allKensho.find((k) => k.id === id);
}

export function getRelatedKensho(id: string, category: Category): Kensho[] {
  return getActiveKensho()
    .filter((k) => k.id !== id && k.category === category)
    .slice(0, 3);
}

/**
 * 締切まで何日か（当日=0）
 */
export function daysUntilDeadline(deadline: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(deadline);
  d.setHours(0, 0, 0, 0);
  return Math.ceil((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export function isClosingSOon(deadline: string): boolean {
  return daysUntilDeadline(deadline) <= 3;
}

export function formatDeadline(deadline: string): string {
  const d = new Date(deadline);
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}
