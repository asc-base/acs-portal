import { FC } from "react";
import { Card, CardContent, CardMedia, Typography, Box } from "@mui/material";
import { IStudent } from "@/core/domain/student";
import { StudentDefaultAvatar } from "@/components/student-default-avatar";

export const StudentCard: FC<IStudent> = (props) => {
  return (
    <Card className="flex max-h-85 !min-h-75 !w-40.5 cursor-pointer flex-col !rounded-2xl transition-all duration-300 hover:-translate-y-1 xl:!w-67">
      {props.user.imageUrl ? (
        <CardMedia
          className="h-39.5 object-cover lg:h-59"
          sx={{
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          component="img"
          image={props.user.imageUrl}
          alt={`${props.user.firstNameTh} ${props.user.lastNameTh}`}
        />
      ) : (
        <div className="h-39.5 lg:h-59">
          <StudentDefaultAvatar
            prefix={props.user.prefix}
            alt={`${props.user.firstNameTh} ${props.user.lastNameTh}`}
            variant="square"
            sx={{
              width: "100%",
              height: "100%",
              "& img": { objectPosition: "center bottom" },
            }}
          />
        </div>
      )}
      <CardContent className="flex flex-1 flex-col justify-center gap-1 p-3 !pb-3 text-left lg:p-4 lg:!pb-4">
        <Typography component="h2" className="!text-primary01 text-left !font-bold">
          <span className="lg:hidden">
            {`${props.user.firstNameTh} ${props.user.lastNameTh}`.length >=
            16 ? (
              <>
                {props.user.firstNameTh}
                <br />
                {props.user.lastNameTh}
              </>
            ) : (
              `${props.user.firstNameTh} ${props.user.lastNameTh}`
            )}
          </span>
          <span className="hidden lg:inline">
            {props.user.firstNameTh} {props.user.lastNameTh}
          </span>
        </Typography>
        <Box className="mt-1 flex w-full flex-row items-center justify-between">
          <Typography component="h4" className="!text-neutral05">
            รุ่นที่ {props.classBookID}
          </Typography>
          <Typography component="h4" className="!text-neutral05">
            {`${props.studentCode.slice(0, 2)}-${props.studentCode.slice(-3)}`}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};
