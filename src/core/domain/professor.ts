import { User } from "./user";
import { Position } from "./master-data";
import { ExpertField } from "./expert-field";
import { Education } from "./education";

export interface IProfessor {
    id: number;
    user: User;
    majorPositions: Position;
    academicPositions: Position;
    profRoom: string;
    expertFields: ExpertField[];
    educations: Education[];
}