import { API_URL } from "@/config/config";
import { TypeCourse } from "@/interface/typecourse";

export const getTypeCourses = async (): Promise<TypeCourse[] | Error> => {
  const response = await fetch(`${API_URL}/master-data/typecourse`);

  if (!response.ok) {
    return new Error("Failed to fetch typecourses");
  }

  const data = await response.json();
  return data.data;
};
