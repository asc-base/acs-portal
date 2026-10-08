export interface NewsCardProps {
  news: {
    title: string;
    startDate: Date;
    dueDate?: Date | null;
    thumbnailURL: string;
    highlightURL?: string | null;
    cardFocalPointX?: number | null;
    cardFocalPointY?: number | null;
  };
  onDelete?: () => void;
  onEdit?: () => void;
}
