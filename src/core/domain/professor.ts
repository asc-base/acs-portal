export interface IProfessor {
    id: number;
    firstNameTh: string;
    lastNameTh: string;
    firstNameEn: string;
    lastNameEn: string;
    email: string;
    majorPositionId: number;
    academicPositionId: number;
    profRoom: string;
    IsPassword: boolean;
    expertFields: string[];
    educations: string[];
    image: string;
    createdBy: number;
    updatedBy: number;
    createdDate: Date;
    updatedDate: Date;
}