import { ICourse } from "@/features/courses/domain/course";
import { IClassBook } from "@/features/classbook/domain/classbook";
import type { ProjectLookup } from "@/shared/schema/references";
export interface filterListprops {
  classBooks: IClassBook[];
  type: ProjectLookup[];
  field: ProjectLookup[];
  category: ProjectLookup[];
  course: ICourse[];
}
