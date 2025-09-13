"use server";
import { fetchExampleData } from "@/core/viewmodels/example";

export async function getExampleData() {
  try {
    const data = await fetchExampleData();
    return data;
  } catch (error) {
    console.error("Error fetching example data:", error);
    throw error;
  }
}
