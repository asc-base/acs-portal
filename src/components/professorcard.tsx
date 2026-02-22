import React, { FC } from "react";
import { CardMedia, CardContent, Typography } from "@mui/material";
import ApartmentIcon from "@mui/icons-material/Apartment";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import { IProfessor } from "@/core/domain/professor";

export const ProfessorCard: FC<IProfessor> = (props) => {
  return (
    <div className="h-full w-[280px] overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:-translate-y-2 cursor-pointer">
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
      <CardContent className="flex flex-col items-center justify-start p-4 text-center gap-2">
        <div>
          <Typography
            className={
              "!text-primary01 !font-bold " +
              ((props.user.firstNameTh + props.user.lastNameTh).length > 18
                ? "!text-h3"
                : "!text-h2")
            }
          >
            {props.user.firstNameTh} {props.user.lastNameTh}
          </Typography>

          <Typography
            className={
              "!text-primary01 !font-bold " +
              ((props.user.firstNameEn + props.user.lastNameEn).length > 18
                ? "!text-h3"
                : "!text-h2")
            }
          >
            {props.user.firstNameEn} {props.user.lastNameEn}
          </Typography>
        </div>

        <Typography className="!text-h5 !text-primary01 flex items-center gap-3 ">
          <span className="flex items-center gap-1">
            <ApartmentIcon fontSize="small" className="!text-neutral04" />
            {props.profRoom}
          </span>

          <span className="flex items-center gap-1">
            <LocalPhoneOutlinedIcon fontSize="small" className="!text-neutral04" />
            {props.phone}
          </span>
        </Typography>

        <Typography className="!text-h5 !text-primary01">
          <span>
            <MailOutlineIcon fontSize="small" className="!text-neutral04" />{" "}
            {props.user.email}
          </span>
        </Typography>
      </CardContent>
    </div>
  );
};
