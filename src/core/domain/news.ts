import { Category } from "./list-type";

export interface INews {
  id: number;
  title: string;
  image: string;
  detail: string;
  startDate: Date;
  dueDate: null;
  createdBy: number;
  updatedBy: number;
  category: Category;
}
