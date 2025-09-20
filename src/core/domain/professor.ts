import { IUser } from "./user";
import { Position } from "./master-data";
import { IExpertField } from "./expert-field";
import { IEducation } from "./education";

export interface IProfessor {
    id: number;
    user: IUser;
    majorPositions: Position;
    academicPositions: Position;
    profRoom: string;
    expertFields: IExpertField[];
    educations: IEducation[];
}