import React, { FC } from "react";
import { CardMedia, CardContent, Typography } from "@mui/material";
import ApartmentIcon from "@mui/icons-material/Apartment";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import { ProfessorCardProps } from "@/interface/professorcard";

export const ProfessorCard: FC<ProfessorCardProps> = (props) => {
  return (
    <div className="h-full w-full max-w-[280px] overflow-hidden rounded-2xl shadow-lg">
      <CardMedia
        sx={{
          height: "200px",
          width: "100%",
          backgroundSize: "cover",
          backgroundPosition: "center",
          objectFit: "cover",
          objectPosition: "center",
        }}
        component="img"
        image={props.user.imageUrl}
        alt={`${props.user.firstNameTh} ${props.user.lastNameTh}`}
      />
      <CardContent className="flex flex-col items-center justify-start p-4 text-center">
        <Typography className="!text-h3 !text-primary01 !font-bold">
          {props.user.firstNameTh} {props.user.lastNameTh}
        </Typography>
        <Typography className="!text-h3 !text-primary01 !font-bold">
          {props.user.firstNameEn} {props.user.lastNameEn}
        </Typography>

        <Typography className="!text-h4 lg:!text-h5 !text-primary01">
          <ApartmentIcon fontSize="small" className="!text-neutral04" />{" "}
          {props.profRoom}
        </Typography>
        <Typography className="!text-h4 lg:!text-h5 !text-primary01">
          <span>
            <MailOutlineIcon fontSize="small" className="!text-neutral04" />{" "}
            {props.user.email}
          </span>
        </Typography>
      </CardContent>
    </div>
  );
};
