import React, { FC } from "react";
import { CardMedia, CardContent, Typography } from "@mui/material";
import { IProfessor } from "@/core/domain/professor";

export const ProfessorCard: FC<IProfessor> = (props) => {
  return (
    <div className="h-full w-[280px] cursor-pointer overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:-translate-y-2">
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
      <CardContent className="flex flex-1 flex-col justify-center gap-1 p-3 !pb-3 text-left lg:p-4 lg:!pb-4">
        <Typography
          component="h3"
          className="!text-primary01 text-left !font-bold"
        >
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

        <Typography component="h4" className="!text-neutral05 text-left">
          {props.user.firstNameEn} {props.user.lastNameEn}
        </Typography>
      </CardContent>
    </div>
  );
};
