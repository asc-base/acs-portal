import { ICourse } from "./course";
import { IClassBook } from "./classbook";
import { Tag } from "./list-type";
export interface filterListprops {
  classBooks: IClassBook[];
  type: Tag[];
  field: Tag[];
  category: Tag[];
  course: ICourse[];
}
