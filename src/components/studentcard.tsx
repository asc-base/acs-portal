import { FC } from "react";
import { Card, CardContent, CardMedia, Typography, Box } from "@mui/material";
import { IStudent } from "@/core/domain/student";
import { StudentDefaultAvatar } from "@/components/student-default-avatar";

export const StudentCard: FC<IStudent> = (props) => {
  return (
    <Card className="flex !w-40.5 cursor-pointer flex-col !rounded-2xl transition-all duration-300 hover:-translate-y-1 md:!w-40 lg:!w-52 xl:!w-67">
      {props.imageUrl ? (
        <CardMedia
          className="h-39.5 object-cover md:h-44 lg:h-59"
          sx={{
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          component="img"
          image={props.imageUrl}
          alt={`${props.firstNameTh} ${props.lastNameTh}`}
        />
      ) : (
        <div className="h-39.5 md:h-44 lg:h-59">
          <StudentDefaultAvatar
            prefix={props.prefix}
            alt={`${props.firstNameTh} ${props.lastNameTh}`}
            variant="square"
            sx={{
              width: "100%",
              height: "100%",
              "& img": { objectPosition: "center bottom" },
            }}
          />
        </div>
      )}
      <CardContent className="flex flex-initial flex-col justify-center gap-1 p-3 !pb-3 text-left lg:p-4 lg:!pb-4">
        <Typography
          noWrap
          component="h2"
          className="!text-primary01 text-left !font-bold !text-sm lg:!text-base !truncate w-full block"
        >
          {props.firstNameTh} {props.lastNameTh}
        </Typography>
        <Box className="mt-1 flex w-full flex-row items-center justify-between">
          <Typography component="h4" className="!text-neutral05 !text-xs lg:!text-sm">
            รุ่นที่ {props.student.classBookID}
          </Typography>
          <Typography component="h4" className="!text-neutral05 !text-xs lg:!text-sm">
            {`${props.student.studentCode.slice(0, 2)}-${props.student.studentCode.slice(-3)}`}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};
