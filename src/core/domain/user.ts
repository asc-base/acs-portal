export interface UserPrefix {
    id: number;
    nameTh: string;
    nameEn?: string;
}

export interface IUser {
    id: number;
    email: string;
    firstNameTh: string;
    lastNameTh: string;
    firstNameEn: string;
    lastNameEn: string;
    nickName?: string;
    imageUrl: string;
    prefix?: UserPrefix | null;
}

export interface UserRole {
    id: number;
    name: string;
}

export interface UserProfile extends IUser {
    roles: UserRole[];
}
