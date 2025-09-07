import { Card, Typography } from "@mui/material";
import React, { FC } from "react";
import WatchLaterOutlinedIcon from "@mui/icons-material/WatchLaterOutlined";
import { ActivityCardProps } from "@/interface/activity";

export const ActivityCard: FC<ActivityCardProps> = (props) => {
  const date = `${new Date(props.date).getDate()} ${new Date(
    props.date,
  ).toLocaleString("th-TH", {
    month: "long",
  })} ${new Date(props.date).getFullYear() + 543}`;
  return (
    <Card className="!bg-neutral02 !mt-10v !rounded-2xl !px-6 !py-5 !shadow-[2px_2px_3px_0px_#0702201A]">
      <div className="flex flex-col gap-[10px]">
        <h1 className="text-primary01 text-h3 max-xl:text-h4 line-clamp-1 !font-bold">
          {props?.title}
        </h1>
        <div className="flex gap-2">
          <WatchLaterOutlinedIcon className="text-neutral04" />
          <Typography variant="h5" className="text-primary01 !text-h5 !my-auto">
            {date}
          </Typography>
        </div>
      </div>
    </Card>
  );
};
