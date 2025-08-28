export interface MasterData {
  majorPositions: Position[];
  types: EducationLevel[];
  roles: Role[];
  typeCourses: EducationLevel[];
  listTypes: EducationLevel[];
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
