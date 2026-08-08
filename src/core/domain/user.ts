export interface IUser {
    id: number;
    email: string;
    firstNameTh: string;
    lastNameTh: string;
    firstNameEn: string;
    lastNameEn: string;
    nickName?: string;
    imageUrl: string;
    group?: string | { name?: string };
    groups?: Array<string | { name?: string }>;
}
