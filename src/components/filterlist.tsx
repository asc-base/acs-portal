import { useState } from "react";
import { Checkbox, FormControlLabel, FormGroup, Typography, IconButton } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

export const FilterList = () => {
    const [openTypes, setOpenTypes] = useState(false);
    const [openSubjects, setOpenSubjects] = useState(false);
    const [openCategories, setOpenCategories] = useState(false);
    const [openWorkTypes, setOpenWorkTypes] = useState(false);

    const types = [
        "Artificial intelligence",
        "Network",
        "Cloud computing",
        "Security",
        "Computer Architecture",
        "Software Engineering",
        "Computational Theory",
        "GIS",
        "Game Design",
        "Data Science and analytics",
        "Data Structures and Algorithms",
    ];

    const subjects = [
        "CSS123 Software Enginerring",
        "CSS123 Introduction to Network",
        "CSS124 Web Programming",
        "CSS122 Capstone Project",
        "CSS115 Mobile Application",
        "CSS457 Object Oriented Programming",
        "Senior Project",
    ];

    const categories = [
        "Educational",
        "Medical",
        "Research",
        "Business",
        "Game",
        "Agricultural",
    ];

    const workTypes = [
        "Research",
        "Web Application",
        "Mobile Application",
        "Internet Of Things",
        "UX / UI",
    ];

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
        <aside className="w-72 md:w-62 bg-white shadow-md pt-6 pl-4 overflow-y-scroll h-screen">
            <FormGroup>
                <h4>ค้นหาผลงานตามชั้นปี</h4>
                <div className="grid grid-cols-2">
                    <FormControlLabel control={<Checkbox />} label="ปี1" />
                    <FormControlLabel control={<Checkbox />} label="ปี2" />
                    <FormControlLabel control={<Checkbox />} label="ปี3" />
                    <FormControlLabel control={<Checkbox />} label="ปี4" />
                </div>
                {renderSubmenu("ค้นหาผลงานตามประเภท", openTypes, () => setOpenTypes(!openTypes), types)}
                {renderSubmenu("ค้นหาผลงานตามรายวิชา", openSubjects, () => setOpenSubjects(!openSubjects), subjects)}
                {renderSubmenu("หมวดหมู่", openCategories, () => setOpenCategories(!openCategories), categories)}
                {renderSubmenu("ประเภทของชิ้นงาน", openWorkTypes, () => setOpenWorkTypes(!openWorkTypes), workTypes)}
            </FormGroup>
        </aside>
    );
};
