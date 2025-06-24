import { Card, Typography } from '@mui/material'
import React, { FC } from 'react'
import WatchLaterOutlinedIcon from '@mui/icons-material/WatchLaterOutlined';
import { ActivityCardProps } from '@/interface/activity';

export const ActivityCard: FC<ActivityCardProps> = (props) => {
  return (
   <Card className='!rounded-2xl !bg-neutral02 !mt-10v !py-5 !px-6 !shadow-[2px_2px_3px_0px_#0702201A]'>
    <div className="flex flex-col gap-[10px]">
        <Typography variant='h1' className='text-primary01 !text-h3 max-xl:text-h4 !font-bold'>
            {props?.title}
        </Typography>
        <div className='flex gap-2'>
            <WatchLaterOutlinedIcon className='text-neutral04'/>
            <Typography variant='h5' className='text-primary01 !text-h5 !my-auto'>
                {props?.date}
            </Typography>
        </div>

    </div>      
   </Card>
  )
}
