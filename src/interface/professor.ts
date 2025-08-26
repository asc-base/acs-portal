export interface IProfessor {
    id: number;
    firstNameTh: string;
    lastNameTh: string;
    firstNameEn: string;
    lastNameEn: string;
    email: string;
    majorPositionId: number;
    academecpositionId: number;
    profRoom: string;
    IsPassword: boolean;
    expertFeild: string[];
    education: string[];
    image: string
}

export interface ICreateProfessor {
    firstNameTh: string;
    lastNameTh: string;
    firstNameEn: string;
    lastNameEn: string;
    email: string;
    majorPositionId: number;
    academecpositionId: number;
    profRoom: string;
    IsPassword: boolean;
    expertFeild: string[];
    education: string[];
}
