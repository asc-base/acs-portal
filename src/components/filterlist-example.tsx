// Example usage of FilterList component
"use client";
import { useState } from "react";
import { FilterList } from "./filterlist";
import { filterListprops } from "@/core/domain/filterlist";

export const FilterListExample = () => {
  const [queryParams, setQueryParams] = useState<URLSearchParams>(
    new URLSearchParams(),
  );

  // Mock data - replace with your actual data
  const mockData: Omit<filterListprops, "onFilterChange"> = {
    classBooks: [
      { id: 1, firstYearAcademic: "2020", image: "", classof: "Class of 2024" },
      { id: 2, firstYearAcademic: "2021", image: "", classof: "Class of 2025" },
    ],
    field: [
      {
        id: 1,
        name: "Computer Science",
        createdDate: new Date(),
        updatedDate: new Date(),
      },
      {
        id: 2,
        name: "Data Science",
        createdDate: new Date(),
        updatedDate: new Date(),
      },
    ],
    category: [
      {
        id: 1,
        name: "Research",
        createdDate: new Date(),
        updatedDate: new Date(),
      },
      {
        id: 2,
        name: "Project",
        createdDate: new Date(),
        updatedDate: new Date(),
      },
    ],
    type: [
      {
        id: 1,
        name: "Thesis",
        createdDate: new Date(),
        updatedDate: new Date(),
      },
      {
        id: 2,
        name: "Report",
        createdDate: new Date(),
        updatedDate: new Date(),
      },
    ],
    course: [
      {
        id: 1,
        courseId: "CS101",
        courseNameTh: "Introduction to Computer Science",
        courseNameEn: "Introduction to Computer Science",
        credits: "3",
        courseDetail: "Basic CS course",
        createdBy: 1,
        createdDate: new Date(),
        updatedBy: 1,
        updatedDate: new Date(),
        curriculum: {
          id: 1,
          year: "2024",
          fileUrl: "",
          description: "",
          image: "",
        },
        preCourses: [],
      },
    ],
  };

  const handleFilterChange = (params: URLSearchParams) => {
    setQueryParams(params);

    // Example of how to use the params
    console.log("Current filters:", {
      classBooks: params.get("classBooks")?.split(",") || [],
      fields: params.get("fields")?.split(",") || [],
      courses: params.get("courses")?.split(",") || [],
      categories: params.get("categories")?.split(",") || [],
      types: params.get("types")?.split(",") || [],
    });

    // You can now use these params to filter your data
    // For example, make an API call with these parameters
    // fetchFilteredData(params.toString());
  };

  return (
    <div>
      <FilterList {...mockData} onFilterChange={handleFilterChange} />

      {/* Display current query params for debugging */}
      <div className="mt-4 bg-gray-100 p-4">
        <h3>Current Query Params:</h3>
        <pre>{queryParams.toString()}</pre>
      </div>
    </div>
  );
};
