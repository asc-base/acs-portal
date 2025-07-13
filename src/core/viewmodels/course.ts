import { createCourse } from "../models/course";
import { Course } from "@/interface/course";

export const fetchCreateCourse = async (course: Course): Promise<Course | Error> => {
    try {
        const result = await createCourse(course);
        if (result instanceof Error) throw result;
        return result;
    } catch (error) {
        console.error("Error creating course:", error);
        return new Error("Failed to create course");
    }
};