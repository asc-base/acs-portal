import React, { FC } from "react";
import { Card, CardContent, CardMedia, Typography, Box, IconButton } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import GitHubIcon from "@mui/icons-material/GitHub";
import { StudentCardProps } from "@/interface/studentcard";


export const StudentCard: FC<StudentCardProps> = (props) => {
  return (
    <Card className="!w-[162px] lg:!w-[268px] h-full max-h-[340px] !rounded-2xl cursor-pointer"
    >
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
      <CardContent className="flex flex-col text-center justify-center items-center h-[100px]">
        <Typography className="!text-h4 lg:!text-h3 !font-bold !text-primary01 text-center">

          <span className="lg:hidden">
            {`${props.user.firstNameTh} ${props.user.lastNameTh}`.length >= 16 ? (
              <>
                {props.user.firstNameTh}<br />{props.user.lastNameTh}
              </>
            ) : (
              `${props.user.firstNameTh} ${props.user.lastNameTh}`
            )}
          </span>
          <span className="hidden lg:inline">
            {props.user.firstNameTh} {props.user.lastNameTh}
          </span>
        </Typography>
        <Box className="flex flex-col lg:flex-row w-full justify-between items-center lg:mt-4">
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
                sx={{ p: '2px', color: 'var(--color-neutral05)' }}
                onClick={(e) => e.stopPropagation()}
              >
                <FacebookIcon fontSize="small" />
              </IconButton>
            )}
            {props.linkedin && (
              <IconButton
                component="a"
                href={props.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ p: '2px', color: 'var(--color-neutral05)' }}
                onClick={(e) => e.stopPropagation()}
              >
                <LinkedInIcon fontSize="small" />
              </IconButton>
            )}
            {props.instagram && (
              <IconButton
                component="a"
                href={props.instagram}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ p: '2px', color: 'var(--color-neutral05)' }}
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
                sx={{ p: '2px', color: 'var(--color-neutral05)' }}
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
