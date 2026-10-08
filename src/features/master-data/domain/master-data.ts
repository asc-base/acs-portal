import { Tag, TagsGroups } from "@/shared/types/list-type";
import type { NewsCategory } from "@/shared/types/news-category";

export interface MasterData {
  majorPositions: Position[];
  types: IType[];
  roles: Role[];
  typeCourses: TypeCourse[];
  listTypes: IType[];
  educationLevels: EducationLevel[];
  tags: Tag[];
  tagsGroups: TagsGroups[];
  prefixes: Position[];
  newsCategories: NewsCategory[];
}

export interface Position {
  id: number;
  sequence: number;
  nameTh: string;
  nameEn: string;
  shortNameTh: string;
  shortNameEn: string;
}

export interface EducationLevel {
  id: number;
  level?: string;
  createdDate: Date;
  updatedDate: Date;
  name?: string;
  description?: string;
}

export interface Role {
  id: number;
  name: string;
}

export interface IType {
  id: number;
  name: string;
  createdDate: Date;
  updatedDate: Date;
}

export interface TypeCourse {
  id: number;
  type: string;
  description: string;
  createdDate: Date;
  updatedDate: Date;
}
