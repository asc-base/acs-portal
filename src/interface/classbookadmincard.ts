import { IClassBook } from "./classbook";

export interface ClassBookCardProps {
  classbook: IClassBook;
  onView?: () => void;
  onDelete?: () => void;
}
