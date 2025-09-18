import { EducationLevel } from "./master-data";

export interface Education {
    education:  string;
    university: string;
    level:      EducationLevel;
    createdDate:  Date;
    updatedDate:  Date;
    createdBy:  number;
    updatedBy:  number;
}