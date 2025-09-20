export interface InputLogin {
  email: string;
  password: string;
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
}