import { Category } from "@/core/domain/list-type";
import { ICourse } from "./course";
export 
interface filterListprops {
  type: Category[];
  field: Category[];
  category: Category[];
  course: ICourse[];
}