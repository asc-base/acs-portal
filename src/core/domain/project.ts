export interface TeamMember {
  name: string;
  avatarUrl?: string;
}

export interface Project {
  id: number;
  title: string;
  category: string;
  subcategory: string;
  imageUrl: string;
  team: TeamMember[];
}
