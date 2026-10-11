export interface NewsCardProps {
  news: {
    title: string;
    startDate: string;
    dueDate?: string | null;
    thumbnailURL: string | null;
    highlightURL?: string | null;
    cardFocalPointX?: number | null;
    cardFocalPointY?: number | null;
  };
  onDelete?: () => void;
  onEdit?: () => void;
}
