import { Box, Typography } from "@mui/material";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import SportsKabaddiOutlinedIcon from "@mui/icons-material/SportsKabaddiOutlined";

export type EmptyStateType = "news" | "achievement" | "activity";

const EmptyStateMap: Record<
  EmptyStateType,
  {
    title: string;
    description?: string;
    icon: React.ElementType;
  }
> = {
  news: {
    title: "ไม่พบข้อมูลข่าวสารในขณะนี้",
    icon: DescriptionOutlinedIcon,
  },
  achievement: {
    title: "ไม่พบข้อมูลความสำเร็จในขณะนี้",
    icon: EmojiEventsOutlinedIcon,
  },
  activity: {
    title: "ไม่พบข้อมูลกิจกรรมในขณะนี้",
    icon: SportsKabaddiOutlinedIcon,
  },
};

interface EmptyStateProps {
  type: EmptyStateType;
  title?: string;
  description?: string;
  icon?: React.ElementType;
}

const EmptyState = ({ type, title, description, icon }: EmptyStateProps) => {
  const config = EmptyStateMap[type];

  const Icon = icon ?? config.icon;

  return (
    <Box>
      <Box
        sx={{
          textAlign: "center",
          py: 6,
          color: "text.secondary",
        }}
      >
        <Icon
          sx={{
            fontSize: { xs: 110, sm: 110, md: 140 },
            color: "#f5b5ae",
            mb: 2,
          }}
        />

        <Typography fontSize={17}>{title ?? config.title}</Typography>
        <Typography variant="body2" color="text.secondary">
          {description ??
            config.description ??
            "เมื่อมีข่าวสารใหม่ ข้อมูลจะปรากฏที่นี่"}
        </Typography>
      </Box>
    </Box>
  );
};

export default EmptyState;
