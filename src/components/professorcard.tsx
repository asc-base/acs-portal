import React, { FC } from "react";
import { Card, CardMedia,CardContent, Typography } from "@mui/material";
import ApartmentIcon from '@mui/icons-material/Apartment';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { ProfessorCardProps } from "@/interface/professorcard";

export const ProfessorCard: FC<ProfessorCardProps> = (props) => {
    return (
        <Card className="!w-[312px] lg:!w-[268px] h-auto lg:!h-[340px] cursor-pointer !rounded-2xl"
        >
            <CardMedia
                   sx={{
                    height: 180,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
                component="img"
                image={props.user.imageUrl}
                alt={`${props.user.firstNameTh} ${props.user.lastNameTh}`}
            />
            <CardContent className="flex flex-col text-center">
                <Typography className="!text-h3 lg:!text-h2 !font-bold !text-primary01">
                    {props.user.firstNameTh} {props.user.lastNameTh}
                </Typography>
                <Typography className="!text-h3 lg:!text-h2 !font-bold !text-primary01">
                    {props.user.firstNameEn} {props.user.lastNameEn}
                </Typography>

                <Typography className="!text-h4 lg:!text-h5 !text-primary01">
                    <ApartmentIcon fontSize="small" className="!text-neutral04" /> {props.profRoom}
                </Typography>
                <Typography className="!text-h4 lg:!text-h5 !text-primary01">
                    <span><MailOutlineIcon fontSize="small" className="!text-neutral04" /> {props.user.email}</span>
                </Typography>
            </CardContent>
        </Card>
    );
};
