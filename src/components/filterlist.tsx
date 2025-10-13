import { useState } from "react";
import { Checkbox, FormControlLabel, FormGroup, Typography, IconButton } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { filterListprops } from "@/core/domain/filterlist";

export const FilterList = ({type , field, category, course} : filterListprops) => {
    const [openFileds, setOpenFileds] = useState(false);
    const [openCourses, setOpenCourses] = useState(false);
    const [openCategories, setOpenCategories] = useState(false);
    const [openTypes, setOpenTypes] = useState(false);

    const renderSubmenu = (title: string, open: boolean, toggle: () => void, items: string[]) => (
        <div className="flex flex-col">
            <div className="flex items-center cursor-pointer" onClick={toggle}>
                <h4>{title}</h4>
                <IconButton size="small">
                    {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
            </div>
                {open && (
                    items.map((item) => (
                        <FormControlLabel
                            key={item}
                            control={<Checkbox />}
                            label={<h5>{item}</h5>}
                            sx={{ mb: 1 }}
                        />
                    ))
                )}
        </div>
    );

    return (
        <aside className="w-72 md:w-62 bg-white shadow-md pt-6 pl-4 overflow-y-scroll h-full">
            <FormGroup>
                <h4>ค้นหาผลงานตามชั้นปี</h4>
                <div className="grid grid-cols-2">
                    <FormControlLabel control={<Checkbox />} label="ปี1" />
                    <FormControlLabel control={<Checkbox />} label="ปี2" />
                    <FormControlLabel control={<Checkbox />} label="ปี3" />
                    <FormControlLabel control={<Checkbox />} label="ปี4" />
                </div>
                {renderSubmenu("ค้นหาผลงานตามประเภท", openFileds, () => setOpenFileds(!openFileds),field.map((field) => field.name) )}
                {renderSubmenu("ค้นหาผลงานตามรายวิชา", openCourses, () => setOpenCourses(!openCourses), course.map((course) => `${course.courseId} ${course.courseNameTh}`))}
                {renderSubmenu("หมวดหมู่", openCategories, () => setOpenCategories(!openCategories), category.map((category) => category.name))}
                {renderSubmenu("ประเภทของชิ้นงาน", openTypes, () => setOpenTypes(!openTypes), type.map((type) => type.name))}
            </FormGroup>
        </aside>
    );
};
