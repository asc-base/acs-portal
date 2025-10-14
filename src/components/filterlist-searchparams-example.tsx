// Example usage of FilterList component with searchParams
"use client";
import { Suspense } from "react";
import { FilterList } from "./filterlist";
import { filterListprops } from "@/core/domain/filterlist";

// Mock data - replace with your actual data
const mockData: filterListprops = {
  classBooks: [
    { id: 1, firstYearAcademic: "2020", image: "", classof: "Class of 2024" },
    { id: 2, firstYearAcademic: "2021", image: "", classof: "Class of 2025" },
    { id: 3, firstYearAcademic: "2022", image: "", classof: "Class of 2026" },
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
    {
      id: 3,
      name: "Software Engineering",
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
    { id: 3, name: "Thesis", createdDate: new Date(), updatedDate: new Date() },
  ],
  type: [
    {
      id: 1,
      name: "Individual",
      createdDate: new Date(),
      updatedDate: new Date(),
    },
    { id: 2, name: "Group", createdDate: new Date(), updatedDate: new Date() },
    {
      id: 3,
      name: "Presentation",
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
    {
      id: 2,
      courseId: "CS201",
      courseNameTh: "Data Structures and Algorithms",
      courseNameEn: "Data Structures and Algorithms",
      credits: "3",
      courseDetail: "Advanced CS course",
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

// Component that uses FilterList with searchParams
const FilterListPage = () => {
  return (
    <div className="flex">
      {/* FilterList component - automatically syncs with URL */}
      <Suspense fallback={<div>Loading filters...</div>}>
        <FilterList {...mockData} />
      </Suspense>

      {/* Main content area */}
      <main className="flex-1 p-6">
        <h1>Projects</h1>
        <p>
          The FilterList component will automatically update the URL with search
          parameters.
        </p>
        <p>Try selecting some filters and watch the URL change!</p>

        {/* You can access search params in other components too */}
        <SearchParamsDisplay />
      </main>
    </div>
  );
};

// Component to display current search params (for debugging)
const SearchParamsDisplay = () => {
  const searchParams = new URLSearchParams(window.location.search);

  return (
    <div className="mt-6 rounded bg-gray-100 p-4">
      <h3 className="mb-2 font-bold">Current Search Parameters:</h3>
      <pre className="text-sm">
        {searchParams.toString() || "No filters selected"}
      </pre>
      <div className="mt-2 text-sm">
        <p>
          <strong>Class Books:</strong>{" "}
          {searchParams.get("classBooks") || "None"}
        </p>
        <p>
          <strong>Fields:</strong> {searchParams.get("fields") || "None"}
        </p>
        <p>
          <strong>Courses:</strong> {searchParams.get("courses") || "None"}
        </p>
        <p>
          <strong>Categories:</strong>{" "}
          {searchParams.get("categories") || "None"}
        </p>
        <p>
          <strong>Types:</strong> {searchParams.get("types") || "None"}
        </p>
      </div>
    </div>
  );
};

export default FilterListPage;
