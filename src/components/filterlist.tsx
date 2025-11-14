"use client";
import React from "react";
import { IType } from "@/core/domain/master-data";
import { Button, FormControlLabel, FormGroup } from "@mui/material";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ICourse } from "@/core/domain/course";
import Checkbox from "@mui/material/Checkbox";
import { IClassBook } from "@/core/domain/classbook";

interface FilterComponentProps {
  header: string;
  list: IType[] | ICourse[] | IClassBook[];
  searchBy: string;
}

interface FilterListProps {
  categories: IType[];
  fields: IType[];
  types: IType[];
  courses: ICourse[];
  classBooks: IClassBook[];
}

const FilterComponent = ({ header, list, searchBy }: FilterComponentProps) => {
  const [isOpen, setIsOpen] = React.useState(true);
  const [checkedItems, setCheckedItems] = React.useState<Set<string>>(
    new Set(),
  );

  // Initialize checked items from URL search params on mount
  React.useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const values = searchParams.getAll(searchBy);
    setCheckedItems(new Set(values));
  }, [searchBy]);

  const handleSearchParamChange = (itemId: string, checked: boolean) => {
    const searchParams = new URLSearchParams(window.location.search);

    // Update local state
    const newCheckedItems = new Set(checkedItems);
    if (checked) {
      searchParams.append(searchBy, itemId);
      newCheckedItems.add(itemId);
    } else {
      const values = searchParams.getAll(searchBy);
      searchParams.delete(searchBy);
      values
        .filter((v) => v !== itemId)
        .forEach((v) => {
          searchParams.append(searchBy, v);
        });
      newCheckedItems.delete(itemId);
    }

    setCheckedItems(newCheckedItems);
    const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
    window.history.pushState({}, "", newUrl);
  };

  if (list.length === 0) {
    return null;
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h4>{header}</h4>
        <Button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </Button>
      </div>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {list.length > 0 && "classof" in list[0] ? (
          <div className="grid w-full grid-cols-2 gap-2">
            {(list as IClassBook[]).map((item) => (
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    checked={checkedItems.has(item.id.toString())}
                    onChange={(e) =>
                      handleSearchParamChange(
                        item.id.toString(),
                        e.target.checked,
                      )
                    }
                  />
                }
                label={item.classof}
                key={item.id}
              />
            ))}
          </div>
        ) : (
          <FormGroup>
            {list.map((item) => (
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    checked={checkedItems.has(item.id.toString())}
                    onChange={(e) =>
                      handleSearchParamChange(
                        item.id.toString(),
                        e.target.checked,
                      )
                    }
                  />
                }
                label={
                  "name" in item
                    ? item.name
                    : "courseNameTh" in item
                      ? item.courseNameTh
                      : ""
                }
                key={item.id}
              />
            ))}
          </FormGroup>
        )}
      </div>
    </div>
  );
};

export const FilterList = ({
  categories,
  fields,
  types,
  courses,
  classBooks,
}: FilterListProps) => {
  return (
    <aside className="jun-edgeSidebar jun-edgeSidebar-drawer lg:jun-edgeSidebar-permanent jun-edgeSidebar-collapsed-w-[180px] jun-edgeSidebar-permanent-autoCollapse-xl z-0">
      <div className="jun-edgeContent">
        <div className="flex h-full max-h-screen flex-col gap-y-4 overflow-y-auto bg-white p-4 pt-[6rem] pb-32 md:min-h-0 md:pt-4 md:pb-4">
          <FilterComponent
            header="ค้นหาผลงานตามชั้นปี"
            list={classBooks}
            searchBy="classBooks"
          />
          <FilterComponent
            header="ค้นหาตามรายวิชา"
            list={courses}
            searchBy="course"
          />
          <FilterComponent
            header="ค้นหาผลงานตามประเภท"
            list={fields}
            searchBy="fields"
          />
          <FilterComponent
            header="ค้นหาตามหมวดหมู่"
            list={categories}
            searchBy="categories"
          />
          <FilterComponent
            header="ประเภทของชิ้นงาน"
            list={types}
            searchBy="types"
          />
        </div>
      </div>
    </aside>
  );
};
