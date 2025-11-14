"use client";
import { ClassBookCardProps } from "@/interface/classbookadmincard";
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

export const ClassBookAdminCard: FC<ClassBookCardProps> = (props) => {
  const { classbook, onView, onDelete, onEdit } = props;

  return (
    <Card className="w-[362px] h-[420px] !rounded-xl lg:!rounded-2xl">
      <div className="px-6 pt-4 overflow-hidden">
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
          image={classbook.image}
          alt={classbook.classof}
        />
      </div>

      <CardContent className="!px-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold mb-2">
              รุ่น {classbook.classof}
            </h3>
            <h6>
              ปีการศึกษา {classbook.firstYearAcademic}
            </h6>
          </div>
          <IconButton onClick={onEdit}>
            <EditIcon className="cursor-pointer text-primary03"/>
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
            py:1.5
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
            py:1.5
            }}
          >
            ลบ
          </Button>
        )}
      </CardActions>
    </Card>
  );
};
