import { Box } from "@mui/material";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ElementType;
  iconColor?: string;
}

const EmptyState = ({ title, description, icon, iconColor }: EmptyStateProps) => {
  const Icon = icon ?? DescriptionOutlinedIcon;

  return (
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
          color: iconColor ?? "#FFD7CE",
          mb: 2,
        }}
      />

      <h3 className="text-black">{title}</h3>
      {description && (
        <h4 className="text-neutral04 mt-2">
          {description ?? "เมื่อมีข้อมูลใหม่ๆ ข้อมูลจะปรากฏที่นี่"}
        </h4>
      )}
    </Box>
  );
};

export default EmptyState;
