export interface NewsCardProps {
  news: {
    title: string;
    startDate: Date;
    dueDate?: Date | null;
    image: string;
  };
  onDelete?: () => void;
}
