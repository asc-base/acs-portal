import { Card, CardContent, CardMedia, Typography } from "@mui/material";
import React, { FC } from "react";
import { useRouter } from "next/navigation";
import { StudentCardProps } from "@/interface/studentcard";

export const StudentCard: FC<StudentCardProps> = (props) => {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`${props.router}`);
  };

  return (
    <Card
      sx={{ maxWidth: 362 }}
      className="!cursor-pointer !rounded-2xl !shadow-[2px_2px_3px_0px_#0702201A]"
      onClick={handleCardClick}
    >
      <CardMedia
        className="h-[180px] max-xl:h-[156px]"
        sx={{
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        image={props.image}
        title="student card "
      />
      <CardContent className="flex flex-col gap-2 !py-4">
        <Typography
          variant="h3"
          component="div"
          className="!text-h3 max-xl:text-h4 !text-primary01 !text-center"
        >
          {props.title}
        </Typography>
        <Typography
          variant="h3"
          className="!text-h3 max-xl:text-h4 !text-primary01 !text-center"
        >
          {props.description}
        </Typography>
      </CardContent>
    </Card>
  );
};
