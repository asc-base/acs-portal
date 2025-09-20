import { EducationLevel } from "./master-data";

export interface IEducation {
    education:  string;
    university: string;
    level:      EducationLevel;
    createdDate:  Date;
    updatedDate:  Date;
    createdBy:  number;
    updatedBy:  number;
}