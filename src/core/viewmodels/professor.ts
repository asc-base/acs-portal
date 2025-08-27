import { createProfessor } from "@/core/models/professor";
import { ICreateProfessor } from "@/interface/professor";

export const CreateProfessor = async (
    professorData: ICreateProfessor,
    token: string,
    file: File
) => {
    try {
        const formData = new FormData();
        formData.append("firstNameTh", professorData.firstNameTh);
        formData.append("lastNameTh", professorData.lastNameTh);
        formData.append("firstNameEn", professorData.firstNameEn);
        formData.append("lastNameEn", professorData.lastNameEn);
        formData.append("email", professorData.email);
        formData.append("majorPositionId", professorData.majorPositionId.toString());
        formData.append("profRoom", professorData.profRoom);
        formData.append("IsPassword", professorData.IsPassword.toString());
        formData.append("academicPositionId", professorData.academicPositionId.toString());
        formData.append("expertFields", JSON.stringify(professorData.expertFields));
        formData.append("educations", JSON.stringify(professorData.educations));
        if (file) {
            formData.append("image", file);
        }
        const result = await createProfessor(formData, token);

        console.log(result);

        return result;
    } catch (error) {
        console.error("Error creating professor:", error);
        return null;
    }
};
