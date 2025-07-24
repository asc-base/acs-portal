"use server";
import { CreateCurriculum } from "@/core/viewmodels/curriculum";
import { Curriculum } from "@/interface/curriculum";
import { cookies } from "next/headers";

export async function createCurriculumAction( data: Curriculum) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            throw new Error("No authentication token found");
        }

        const result = await CreateCurriculum(data, token);
        return result;
    }
    catch (error) {
        console.error("Error to useDeleteNews: ", error);
        throw error;
    }
}


