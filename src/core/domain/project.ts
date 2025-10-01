export interface TeamMember {
  name: string;
  avatarUrl?: string;
}

export interface IProject {
  id: number;
  title: string;
  category: string;
  subcategory: string;
  imageUrl: string;
  team: TeamMember[];
}
