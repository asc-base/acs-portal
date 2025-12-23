"use client";
import { FC } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  IconButton,
  AvatarGroup,
  Avatar
} from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditIcon from "@mui/icons-material/Edit";
import { AdminCardProps } from "@/interface/admincard";
import { ICurriculum } from "@/core/domain/curriculum";
import { IClassBook } from "@/core/domain/classbook";
import { IProject } from "@/core/domain/project";

const CurriculumContent: FC<{ curriculum: ICurriculum; onEdit?: () => void }> = ({ curriculum, onEdit }) => (
  <div className="flex justify-between items-start">
    <h3 className="font-bold mt-1">หลักสูตรปรับปรุง พ.ศ. {curriculum.year}</h3>
    <IconButton onClick={onEdit}>
      <EditIcon className="cursor-pointer text-primary03" />
    </IconButton>
  </div>
);

const ClassBookContent: FC<{ classbook: IClassBook; onEdit?: () => void }> = ({ classbook, onEdit }) => (
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
      <EditIcon className="cursor-pointer text-primary03 "/>
    </IconButton>
  </div>
);

const ProjectContent: FC<{ project: IProject }> = ({ project }) => {
  const categories = project.projectCategories?.map((category) => category.name).join(", ") || "";
  const types = project.projectTypes?.map((type) => type.name).join(", ") || "";
  return (
    <div className="flex flex-col gap-1 items-start">
      <p className="text-neutral04 text-sm line-clamp-1">
        {categories} 
        {categories && types ? " /" : ""} {types}
      </p>
      <h4 className="font-bold line-clamp-2">
        {project.title}
      </h4>
      
      {project.projectMembers && (
        <AvatarGroup max={4} sx={{ justifyContent: 'flex-end', '& .MuiAvatar-root': { width: 24, height: 24,} }}>
          {project.projectMembers.map((member, idx) => (
            <Avatar key={idx} alt={member.user.firstNameTh} src={member.user.imageUrl} />
          ))}
        </AvatarGroup>
      )}
    </div>
  );
};

export const AdminCard: FC<AdminCardProps> = (props) => {
  const { type, data, onView, onDelete, onEdit } = props;
  let image = "";
  let alt = "";

  if (type === "curriculum") {
    image = data.imageUrl;
    alt = data.year;
  } else if (type === "classBook") {
    image = data.image;
    alt = data.classof;
  } else if (type === "project") {
    image = data.thumbnail || "";
    alt = data.title;
  }

  return (
    <Card className="w-[362px] !rounded-2xl shadow-sm py-5 flex flex-col">
      <div className="px-7 pt-2 overflow-hidden">
        <CardMedia
          sx={{ 
            width: "315px",
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: "12px",
            "@media (min-width: 1024px)": {
              height: type === "project" ? "160px" : "240px",
            },
          }}
          component="img"
          image={image}
          alt={alt}
        />
      </div>

      <CardContent className="!px-7 flex-grow">
        {type === "curriculum" && <CurriculumContent curriculum={data} onEdit={onEdit} />}
        {type === "classBook" && <ClassBookContent classbook={data} onEdit={onEdit} />}
        {type === "project" && <ProjectContent project={data} />}
      </CardContent>

      <CardActions className="flex gap-2 !px-7 !pt-0">
        {onView && (
          <Button
            onClick={onView}
            fullWidth
            variant="outlined"
            size= "large"
            startIcon={<VisibilityOutlinedIcon fontSize="medium"/>}
            sx={{ 
              fontWeight: 700, 
              borderWidth: "2px", 
              py: 1.5, 
            }}
          >
            ดูข้อมูล
          </Button>
        )}

        {onDelete && (
          <Button
            onClick={onDelete}
            fullWidth
            variant="outlined"
            size= "large"
            startIcon={<DeleteOutlineOutlinedIcon fontSize="medium"/>}
            sx={{
              fontWeight: 700,
              borderWidth: "2px",
              color: "var(--color-neutral05)",
              borderColor: "var(--color-neutral03)",
              py: 1.5,
            }}
          >
            ลบ
          </Button>
        )}
      </CardActions>
    </Card>
  );
};