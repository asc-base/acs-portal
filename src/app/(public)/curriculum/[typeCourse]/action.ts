import { fetchCourse } from "@/core/viewmodels/course";
import { Course } from "@/interface/course";

export const getCourse = async (
  page: number,
  pageSize: number,
  searchByTypeCourse: string,
): Promise<Course[]> => {
  try {
    const data = await fetchCourse(page, pageSize, searchByTypeCourse);
    return data.rows;
  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
};
