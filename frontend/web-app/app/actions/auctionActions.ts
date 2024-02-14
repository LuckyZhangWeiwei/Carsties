"use server";
import { Auction, PagedResult } from "@/types";

export async function getData(query: string): Promise<PagedResult<Auction>> {
  let url = `http://localhost:6001/search${query}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("failed to fetch data");
  return res.json();
}
