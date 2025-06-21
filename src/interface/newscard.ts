export interface NewsCardProps {
  title: string;
  createdAt: string;
  image: string;
  isAdmin?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}