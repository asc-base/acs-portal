import React, { FC } from "react";
import { CardMedia, Typography } from "@mui/material";
import ApartmentIcon from "@mui/icons-material/Apartment";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import { IProfessor } from "@/core/domain/professor";

export const ProfessorCardInfo: FC<IProfessor> = (props) => {
  return (
    <div className="flex h-auto min-h-[395px] w-[296px] flex-col overflow-hidden rounded-2xl bg-neutral01 p-[18px] shadow-md">
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
        {props.research_profile?.trim() ? (
          <a
            href={props.research_profile.trim()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-fit items-center rounded-lg bg-primary01 px-4 py-2 font-semibold text-white transition-colors hover:bg-primary02 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary01"
          >
            Research Profile
          </a>
        ) : null}
      </div>
    </div>
  );
};
