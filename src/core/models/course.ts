import { API_URL } from "@/config/config";
import { Course } from "@/interface/course";

export const createCourse = async (course: Course, token: string): Promise<Course | Error> => {
  const response = await fetch(`${API_URL}/course`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(course),
  });

  if (!response.ok) {
    return new Error("Failed to create course");
  }

  const data: Course = await response.json();
  return data;
}