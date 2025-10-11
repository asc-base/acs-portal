export interface TeamMember {
  name: string;
  avatarUrl?: string;
}

export interface IProject {
  id: number;
  title: string;
  thumbnail: string;
  detail: string;
  github: string;
  presentation: string;
  document: string;
  figma: string;
  youtube: string;
  // projectAssets: any[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  createdBy: number;
  updatedBy: number;
}

export interface QueryProject {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
