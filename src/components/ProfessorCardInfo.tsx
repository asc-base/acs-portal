import React, { FC } from "react";
import { CardMedia, Typography } from "@mui/material";
import ApartmentIcon from "@mui/icons-material/Apartment";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import { IProfessor } from "@/core/domain/professor";

export const ProfessorCardInfo: FC<IProfessor> = (props) => {
  return (
    <div className="flex flex-col w-[296px] h-[395px] overflow-hidden rounded-2xl bg-neutral01 p-[18px] shadow-md">
      <CardMedia
        sx={{
          height: "295px",
          width: "260px",
          borderRadius: "16px",
          backgroundSize: "cover",
          backgroundPosition: "center",
          objectFit: "cover",
          objectPosition: "center",
        }}
        component="img"
        image={props.user.imageUrl}
        alt={`${props.user.firstNameTh} ${props.user.lastNameTh}`}
      />
      
      <div className="mt-4 flex flex-col items-center justify-start gap-2 text-center">
        <Typography className="!text-h5 !text-primary01 flex items-center gap-3">
          <span className="flex items-center gap-1">
            <ApartmentIcon sx={{ fontSize: 20 }} className="!text-neutral04" />
            {props.profRoom}
          </span>

          <span className="flex items-center gap-1">
            <LocalPhoneOutlinedIcon sx={{ fontSize: 20 }} className="!text-neutral04" />
            {props.phone}
          </span>
        </Typography>

        <Typography className="!text-h5 !text-primary01">
          <span className="flex items-center gap-1">
            <MailOutlineIcon sx={{ fontSize: 20 }} className="!text-neutral04" />
            {props.user.email}
          </span>
        </Typography>
      </div>
    </div>
  );
};
