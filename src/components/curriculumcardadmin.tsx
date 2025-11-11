"use client";
import { FC } from "react";
import {
  Button,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  IconButton
} from "@mui/material";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditIcon from '@mui/icons-material/Edit';
import { ICurriculum } from "@/core/domain/curriculum";

interface CurriculumAdminCardProps {
  curriculum: ICurriculum;
  onView?: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
}

export const CurriculumAdminCard: FC<CurriculumAdminCardProps> = (props) => {
  const { curriculum, onView, onDelete, onEdit } = props;

  return (
    <Card className="w-[362px] h-[415px] !rounded-xl lg:!rounded-2xl">
      <div className="px-6 pt-6 overflow-hidden">
        <CardMedia
          sx={{
            height: "315px",
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: "12px",
            "@media (min-width: 1024px)": {
              height: "240px",
            },
          }}
          component="img"
          image={curriculum.imageUrl}
          alt={curriculum.year}
        />
      </div>

      <CardContent className="!px-6">
        <div className="flex justify-between items-center">
          <h3 className="font-bold">หลักสูตรปรับปรุง พ.ศ. {curriculum.year}</h3>
          <IconButton onClick={onEdit}>
            <EditIcon className="cursor-pointer text-primary03" />
          </IconButton>
        </div>
      </CardContent>

      <CardActions className="flex gap-2 !px-6 !pt-0">
        {onView && (
          <Button
            onClick={onView}
            size="large"
            variant="outlined"
            fullWidth
            startIcon={<VisibilityOutlinedIcon fontSize="medium" />}
            sx={{
              fontWeight: 700,
              borderWidth: "2px",
              py: 1.5
            }}
          >
            ดูข้อมูล
          </Button>
        )}
        {onDelete && (
          <Button
            onClick={onDelete}
            size="large"
            variant="outlined"
            fullWidth
            startIcon={<DeleteOutlineOutlinedIcon fontSize="medium" />}
            sx={{
              fontWeight: 700,
              color: "var(--color-neutral05)",
              borderWidth: "2px",
              borderColor: "var(--color-neutral03)",
              py: 1.5
            }}
          >
            ลบ
          </Button>
        )}
      </CardActions>
    </Card>
  );
};
