import { createCourse, getCourse } from "@/features/courses/models/course";
import { Course } from "@/features/courses/types/course";

export const fetchCreateCourse = async (course: Course, token: string): Promise<Course | Error> => {
    try {
        const result = await createCourse(course, token);
        if (result instanceof Error) throw result;
        return result;
    } catch (error) {
        console.error("Error creating course:", error);
        return new Error("Failed to create course");
    }
};


export const fetchCourse = async (page: number, pageSize: number, searchByTypeCourse: string) => {
  try {
    const result = await getCourse(page, pageSize,searchByTypeCourse);
    if (result instanceof Error) throw result;
    return result;
  } catch (error) {
    console.error("Error fetching all news:", error);
    return [];
  }
};