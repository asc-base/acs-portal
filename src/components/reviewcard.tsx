import { ReviewCardProps } from "@/interface/reviewcard";
import { Card, CardContent, CardMedia, Typography } from "@mui/material";
import React, { FC } from "react";

const ReviewCard: FC<ReviewCardProps> = (props) => {
  return (
    <Card
      sx={{ maxWidth: 346 }}
      className="!gap-8 !rounded-2xl !p-4 !shadow-[1px_2px_3px_0px_#07022012,_0px_-1px_3px_0px_#07022012]"
    >
      <CardContent className="flex flex-col gap-8">
        <div className="flex flex-col items-center gap-4">
          <CardMedia
            className="!h-[120px] !w-[120px] rounded-full"
            component="img"
            image={props.imageUrl}
            alt="Review image"
            sx={{ aspectRatio: "1/1" }}
          />
          <Typography
            variant="h3"
            className="!text-h3 max-xl:!text-h4 !text-primary03 !text-center !font-bold"
          >
            "{props.quote}"
          </Typography>
        </div>
        <div>
          <Typography
            variant="body2"
            className="!text-h4 max-xl:!text-h5 !text-center"
          >
            {props.description}
          </Typography>
        </div>
        <div className="">
          <Typography
            component="h5"
            className="!text-h4 max-xl:!text-h5 !text-center !font-bold"
          >
            {props.name}
          </Typography>
          <Typography
            variant="body2"
            className="!text-h4 max-xl:!text-h5 !text-center"
          >
            {props.title}
          </Typography>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewCard;
