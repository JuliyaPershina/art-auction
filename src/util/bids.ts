// import { Item } from "@/db/schema";

export function isBidOver(item: { endDate: Date }) {
  return new Date(item.endDate) < new Date();
}