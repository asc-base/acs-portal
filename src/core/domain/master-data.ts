export interface MasterData {
  majorPositions: Position[];
  types: IType[];
  roles: Role[];
  typeCourses: TypeCourse[];
  listTypes: IType[];
  educationLevels: EducationLevel[];
  academicPositions: Position[];
}

export interface Position {
  id: number;
  positionTh: string;
  positionEn: string;
  createdDate: Date;
  updatedDate: Date;
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
