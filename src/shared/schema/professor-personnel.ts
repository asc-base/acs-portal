import { z } from "zod";

export const ProfessorPersonnelTypeSchema = z.enum([
  "CURRICULUM_HEAD",
  "LECTURER",
  "CURRICULUM_STAFF",
]);

export const professorPersonnelLabels = {
  CURRICULUM_HEAD: "หัวหน้าหลักสูตร",
  LECTURER: "อาจารย์",
  CURRICULUM_STAFF: "เจ้าหน้าที่ประจำหลักสูตร",
};
