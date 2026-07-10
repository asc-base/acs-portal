import { FC } from "react";
import { Card, CardContent, CardMedia, Typography, Box } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { IStudent } from "@/core/domain/student";

export const StudentCard: FC<IStudent> = (props) => {
  return (
    <Card className="flex max-h-[340px] !min-h-[300px] !w-[162px] cursor-pointer flex-col !rounded-2xl transition-all duration-300 hover:-translate-y-1 xl:!w-[268px]">
      {props.user.imageUrl ? (
        <CardMedia
          sx={{
            height: { sm: 158, lg: 236 },
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          component="img"
          image={props.user.imageUrl}
          alt={`${props.user.firstNameTh} ${props.user.lastNameTh}`}
        />
      ) : (
        <Box
          sx={{
            height: { xs: 158, lg: 240 },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "var(--color-neutral02)",
          }}
        >
          <AccountCircleIcon
            sx={{
              fontSize: { sm: 80, lg: 120 },
              color: "var(--color-neutral05)",
            }}
          />
        </Box>
      )}
      <CardContent className="flex flex-1 flex-col justify-center gap-1 p-3 !pb-3 text-left lg:p-4 lg:!pb-4">
        <Typography className="!text-h2 !text-primary01 text-left !font-bold">
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
          <Typography className="!text-h4 !text-neutral05">
            รุ่นที่ {props.classBookID}
          </Typography>
          <Typography className="!text-h4 !text-neutral05">
            {`${props.studentCode.slice(0, 2)}-${props.studentCode.slice(-3)}`}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};
