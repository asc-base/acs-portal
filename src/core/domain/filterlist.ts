import { Category } from "@/core/domain/list-type";
import { ICourse } from "./course";
import { IClassBook } from "./classbook";
export interface filterListprops {
  classBooks: IClassBook[];
  type: Category[];
  field: Category[];
  category: Category[];
  course: ICourse[];
}
