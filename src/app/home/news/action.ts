"use server";
import { UseDeleteNews } from "@/core/viewmodels/news";
import { cookies } from "next/headers";

export async function deleteNews(id: string) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            throw new Error("No authentication token found");
        }

        const data = await UseDeleteNews(id, token);
        return data;
    }
    catch (error) {
        console.error("Error to useDeleteNews: ", error);
        throw error;
    }
}
