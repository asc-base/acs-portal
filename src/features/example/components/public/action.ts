"use server";
import { unstable_rethrow } from "next/navigation";
import { fetchExampleData } from "@/features/example/viewmodels/example";

export async function getExampleData() {
  try {
    return await fetchExampleData();
  } catch (error) {
    unstable_rethrow(error);
    console.error("Error fetching example data:", error);
    throw error;
  }
}
