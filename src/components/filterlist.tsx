"use client";
import React from "react";
import { IType } from "@/core/domain/master-data";
import { Button, FormControlLabel, FormGroup } from "@mui/material";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ICourse } from "@/core/domain/course";
import Checkbox from "@mui/material/Checkbox";
import { IClassBook } from "@/core/domain/classbook";
import { Tag } from "@/core/domain/list-type";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

interface FilterComponentProps {
  header: string;
  list: IType[] | ICourse[] | IClassBook[] | Tag[];
  searchBy: string;
}

interface FilterListProps {
  categories: Tag[];
  fields: Tag[];
  types: Tag[];
  courses: ICourse[];
  classBooks: IClassBook[];
}

const FilterComponent = ({ header, list, searchBy }: FilterComponentProps) => {
  const [isOpen, setIsOpen] = React.useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [checkedItems, setCheckedItems] = React.useState<Set<string>>(
    new Set(),
  );

  React.useEffect(() => {
    setCheckedItems(new Set(searchParams.getAll(searchBy)));
  }, [searchParams, searchBy]);

  const handleSearchParamChange = (itemId: string, checked: boolean) => {
    const params = new URLSearchParams(searchParams.toString());

    if (checked) {
      params.append(searchBy, itemId);
    } else {
      const values = params.getAll(searchBy);
      params.delete(searchBy);
      values
        .filter((v) => v !== itemId)
        .forEach((v) => params.append(searchBy, v));
    }
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`, {
      scroll: false,
    });
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
            searchBy="courses"
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
