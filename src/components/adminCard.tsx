"use client";
import { FC } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  AvatarGroup,
  Avatar,
} from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { AdminCardProps } from "@/interface/admincard";
import { ICurriculum } from "@/core/domain/curriculum";
import { IClassBook } from "@/core/domain/classbook";
import { IProject } from "@/core/domain/project";
import { INews } from "@/core/domain/news";

const CurriculumContent: FC<{ curriculum: ICurriculum }> = ({ curriculum }) => (
    <h3 className="mt-1 font-bold text-start">
      {curriculum.title} พ.ศ. {curriculum.year}
    </h3>
);

const ClassBookContent: FC<{ classbook: IClassBook }> = ({ classbook }) => (
  <div className="flex items-start">
    <div>
      <h3 className="mb-2 font-bold">รุ่น {classbook.classof}</h3>
      <h6>ปีการศึกษา {classbook.firstYearAcademic}</h6>
    </div>
  </div>
);

const ProjectContent: FC<{ project: IProject }> = ({ project }) => {
  const categories =
    project.projectCategories?.map((category) => category.name).join(", ") ||
    "";
  const types = project.projectTypes?.map((type) => type.name).join(", ") || "";
  return (
    <div className="flex flex-col items-start gap-1">
      <p className="text-neutral04 line-clamp-1 text-sm">
        {categories}
        {categories && types ? " /" : ""} {types}
      </p>
      <h4 className="line-clamp-2 font-bold">{project.title}</h4>

      {project.projectMembers && (
        <AvatarGroup
          max={4}
          sx={{
            justifyContent: "flex-end",
            "& .MuiAvatar-root": { width: 24, height: 24 },
          }}
        >
          {project.projectMembers.map((member, idx) => (
            <Avatar
              key={idx}
              alt={member.user.firstNameTh}
              src={member.user.imageUrl}
            />
          ))}
        </AvatarGroup>
      )}
    </div>
  );
};

const NewsContent: FC<{ news: INews }> = ({ news }) => {
  return (
    <div className="flex flex-col items-start gap-1">
      <h3 className="line-clamp-2 font-bold">{news.title}</h3>
      <h6>
        {" "}
        {new Date(news.startDate).toLocaleDateString("th-TH", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </h6>
    </div>
  );
};

export const AdminCard: FC<AdminCardProps> = (props) => {
  const { type, data, onView, onDelete } = props;
  let image = "";
  let alt = "";

  if (type === "curriculum") {
    image = data.thumbnailURL;
    alt = data.year;
  } else if (type === "classBook") {
    image = data.thumbnailURL;
    alt = String(data.classof);
  } else if (type === "project") {
    image = data.thumbnail || "";
    alt = data.title;
  } else if (type === "news") {
    image = data.image;
    alt = data.title;
  }

  return (
    <Card className="flex w-[362px] flex-col !rounded-2xl py-5 shadow-sm">
      <div className="overflow-hidden px-7 pt-2">
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

      <CardContent className="flex-grow !px-7">
        {type === "curriculum" && (
          <CurriculumContent curriculum={data}/>
        )}
        {type === "classBook" && (
          <ClassBookContent classbook={data}/>
        )}
        {type === "project" && <ProjectContent project={data} />}
        {type === "news" && <NewsContent news={data} />}
      </CardContent>

      <CardActions className="flex gap-2 !px-7 !pt-0">
        {onView && (
          <Button
            onClick={onView}
            fullWidth
            variant="outlined"
            size="large"
            startIcon={<VisibilityOutlinedIcon fontSize="medium" />}
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
            size="large"
            startIcon={<DeleteOutlineOutlinedIcon fontSize="medium" />}
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
