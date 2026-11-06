import { ICourse } from "@/features/courses/domain/course";
import { IClassBook } from "@/features/classbook/domain/classbook";
import { Tag } from "@/shared/types/list-type";
export interface filterListprops {
  classBooks: IClassBook[];
  type: Tag[];
  field: Tag[];
  category: Tag[];
  course: ICourse[];
}
