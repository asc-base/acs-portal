"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  IconButton,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { filterListprops } from "@/core/domain/filterlist";

interface FilterState {
  classBooks: number[];
  fields: number[];
  courses: number[];
  categories: number[];
  types: number[];
}

const renderSubmenu = (
  title: string,
  open: boolean,
  toggle: () => void,
  items: { id: number; label: string }[],
  checkedItems: number[],
  onItemChange: (id: number, checked: boolean) => void,
) => (
  <div className="flex flex-col">
    <div className="flex cursor-pointer items-center" onClick={toggle}>
      <h4>{title}</h4>
      <IconButton size="small">
        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
      </IconButton>
    </div>
    {open &&
      items.map((item) => (
        <FormControlLabel
          key={item.id}
          control={
            <Checkbox
              checked={checkedItems.includes(item.id)}
              onChange={(e) => onItemChange(item.id, e.target.checked)}
            />
          }
          label={<h5>{item.label}</h5>}
          sx={{ mb: 1 }}
        />
      ))}
  </div>
);

export const FilterList = ({
  type,
  field,
  category,
  course,
  classBooks,
}: filterListprops) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [openFileds, setOpenFileds] = useState(false);
  const [openCourses, setOpenCourses] = useState(false);
  const [openCategories, setOpenCategories] = useState(false);
  const [openTypes, setOpenTypes] = useState(false);

  // Initialize filter state from URL search params
  const [filterState, setFilterState] = useState<FilterState>({
    classBooks: [],
    fields: [],
    courses: [],
    categories: [],
    types: [],
  });

  // Parse search params to numbers array
  const parseSearchParam = (paramValue: string | null): number[] => {
    if (!paramValue) return [];
    return paramValue
      .split(",")
      .map((id) => parseInt(id, 10))
      .filter((id) => !isNaN(id));
  };

  // Initialize state from URL on component mount
  useEffect(() => {
    const initialState: FilterState = {
      classBooks: parseSearchParam(searchParams.get("classBooks")),
      fields: parseSearchParam(searchParams.get("fields")),
      courses: parseSearchParam(searchParams.get("courses")),
      categories: parseSearchParam(searchParams.get("categories")),
      types: parseSearchParam(searchParams.get("types")),
    };
    setFilterState(initialState);
  }, [searchParams]);

  const updateQueryParams = (newState: FilterState) => {
    const params = new URLSearchParams(searchParams);

    // Update or remove parameters based on state
    Object.entries(newState).forEach(([key, value]) => {
      if (value.length > 0) {
        params.set(key, value.join(","));
      } else {
        params.delete(key);
      }
    });

    // Update URL without page refresh
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleItemChange = (
    filterType: keyof FilterState,
    id: number,
    checked: boolean,
  ) => {
    const newState = { ...filterState };

    if (checked) {
      newState[filterType] = [...newState[filterType], id];
    } else {
      newState[filterType] = newState[filterType].filter((item) => item !== id);
    }

    setFilterState(newState);
    updateQueryParams(newState);
  };

  return (
    <aside className="h-full w-72 bg-white pt-6 pl-4 shadow-md md:w-62">
      <FormGroup>
        <h4>ค้นหาผลงานตามชั้นปี</h4>
        <div className="grid grid-cols-2">
          {classBooks.map((classBook, index) => (
            <FormControlLabel
              key={classBook.id}
              control={
                <Checkbox
                  checked={filterState.classBooks.includes(classBook.id)}
                  onChange={(e) =>
                    handleItemChange(
                      "classBooks",
                      classBook.id,
                      e.target.checked,
                    )
                  }
                />
              }
              label={<h5>{`ปี ${index + 1}`}</h5>}
              sx={{ mb: 1 }}
            />
          ))}
        </div>
        {renderSubmenu(
          "ค้นหาผลงานตามประเภท",
          openFileds,
          () => setOpenFileds(!openFileds),
          field.map((field) => ({ id: field.id, label: field.name })),
          filterState.fields,
          (id, checked) => handleItemChange("fields", id, checked),
        )}
        {renderSubmenu(
          "ค้นหาผลงานตามรายวิชา",
          openCourses,
          () => setOpenCourses(!openCourses),
          course.map((course) => ({
            id: course.id,
            label: `${course.courseId} ${course.courseNameTh}`,
          })),
          filterState.courses,
          (id, checked) => handleItemChange("courses", id, checked),
        )}
        {renderSubmenu(
          "หมวดหมู่",
          openCategories,
          () => setOpenCategories(!openCategories),
          category.map((category) => ({
            id: category.id,
            label: category.name,
          })),
          filterState.categories,
          (id, checked) => handleItemChange("categories", id, checked),
        )}
        {renderSubmenu(
          "ประเภทของชิ้นงาน",
          openTypes,
          () => setOpenTypes(!openTypes),
          type.map((type) => ({ id: type.id, label: type.name })),
          filterState.types,
          (id, checked) => handleItemChange("types", id, checked),
        )}
      </FormGroup>
    </aside>
  );
};
