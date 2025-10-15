import React, { FC } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import GitHubIcon from "@mui/icons-material/GitHub";
import { StudentCardProps } from "@/interface/studentcard";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

export const StudentCard: FC<StudentCardProps> = (props) => {
  return (
    <Card className="h-full max-h-[340px] !w-[162px] cursor-pointer !rounded-2xl lg:!w-[268px]">
      {props.user.imageUrl ? (
        <CardMedia
          sx={{
            height: { sm: 156, lg: 240 },
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
            height: { sm: 156, lg: 240 },
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
      <CardContent className="flex h-[100px] flex-col items-center justify-center text-center">
        <Typography className="!text-h4 lg:!text-h3 !text-primary01 text-center !font-bold">
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
        <Box className="flex w-full flex-col items-center justify-between lg:mt-4 lg:flex-row">
          <Typography className="!text-h5 lg:!text-h4 !text-primary01">
            {`${props.studentId.slice(0, 2)}-${props.studentId.slice(-3)}`}
          </Typography>
          <Box className="flex">
            {props.facebook && (
              <IconButton
                component="a"
                href={props.facebook}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ p: "2px", color: "var(--color-neutral05)" }}
                onClick={(e) => e.stopPropagation()}
              >
                <FacebookIcon fontSize="small" />
              </IconButton>
            )}
            {props.linkin && (
              <IconButton
                component="a"
                href={props.linkin}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ p: "2px", color: "var(--color-neutral05)" }}
                onClick={(e) => e.stopPropagation()}
              >
                <LinkedInIcon fontSize="small" />
              </IconButton>
            )}
            {props.instragram && (
              <IconButton
                component="a"
                href={props.instragram}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ p: "2px", color: "var(--color-neutral05)" }}
                onClick={(e) => e.stopPropagation()}
              >
                <InstagramIcon fontSize="small" />
              </IconButton>
            )}
            {props.github && (
              <IconButton
                component="a"
                href={props.github}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ p: "2px", color: "var(--color-neutral05)" }}
                onClick={(e) => e.stopPropagation()}
              >
                <GitHubIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
