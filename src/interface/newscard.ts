export interface NewsCardProps {
  news: {
    title: string;
    startDate: Date;
    dueDate?: Date | null;
    //image: string;
    thumbnailURL: string;
    highlightURL: string;
  };
  onDelete?: () => void;
  onEdit?: () => void;
}
