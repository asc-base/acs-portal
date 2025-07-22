"use server";
import { ICreateNews } from "@/interface/news";
import { CreateNews } from "@/core/viewmodels/news";
import { cookies } from "next/headers";

export const createNewsAction = async (
  newsData: ICreateNews,
  file: File,
): Promise<void> => {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    throw new Error("Authentication token is missing");
  }

  try {
    const result = await CreateNews(newsData, token, file);
    if (!result) {
      console.log(result);
      throw new Error("Failed to create news");
    }
  } catch (error) {
    console.error("Error creating news:", error);
    throw new Error("Failed to process news creation");
  }
};
