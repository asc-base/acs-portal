import { API_URL } from "@/infra/container";
import { Course } from "@/interface/course";

export const createCourse = async (
  course: Course,
  token: string,
): Promise<Course | Error> => {
  const response = await fetch(`${API_URL}/course`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(course),
  });

  if (!response.ok) {
    return new Error("Failed to create course");
  }

  const data: Course = await response.json();
  return data;
};

export const getCourse = async (
  page: number,
  pageSize: number,
  searchByTypeCourse: string,
): Promise<Course[] | Error> => {
  const response = await fetch(
    `${API_URL}/course?page=${page}&pageSize=${pageSize}&searchByTypeCourse=${searchByTypeCourse}`,
  );

  if (!response.ok) {
    return new Error("Failed to fetch Course");
  }

  const data = await response.json();
  return data.data;
};
