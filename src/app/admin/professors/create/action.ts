"use server"
import { ICreateProfessor } from "@/interface/professor"
import { CreateProfessor } from "@/core/viewmodels/professor";
import { cookies } from "next/headers";

export const createProfessorAction = async (
    professorData: ICreateProfessor,
    file: File,
): Promise<void> => {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
        throw new Error("Authentication token is missing");
    }

    try {
        const result = await CreateProfessor(professorData, token, file);
        if (!result) {
            console.log(result);
            throw new Error("Failed to create professor");
        }
    } catch (error) {
        console.error("Error creating professor:", error);
        throw new Error("Failed to process professor creation");
    }
}