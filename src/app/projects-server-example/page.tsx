// Server component example - how to use FilterList with server-side searchParams
import { Suspense } from "react";
import { FilterList } from "@/components/filterlist";
import { filterListprops } from "@/core/domain/filterlist";

// This would be your actual data fetching functions
async function getFilterData(): Promise<filterListprops> {
  // Replace with your actual API calls
  return {
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
        name: "Individual",
        createdDate: new Date(),
        updatedDate: new Date(),
      },
      {
        id: 2,
        name: "Group",
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
}

async function getFilteredProjects(searchParams: {
  [key: string]: string | string[] | undefined;
}) {
  // Parse the search params to get filter IDs
  const classBookIds = searchParams.classBooks
    ? String(searchParams.classBooks).split(",").map(Number)
    : [];
  const fieldIds = searchParams.fields
    ? String(searchParams.fields).split(",").map(Number)
    : [];
  const courseIds = searchParams.courses
    ? String(searchParams.courses).split(",").map(Number)
    : [];
  const categoryIds = searchParams.categories
    ? String(searchParams.categories).split(",").map(Number)
    : [];
  const typeIds = searchParams.types
    ? String(searchParams.types).split(",").map(Number)
    : [];

  console.log("Filtering with:", {
    classBookIds,
    fieldIds,
    courseIds,
    categoryIds,
    typeIds,
  });

  // Here you would filter your projects based on these IDs
  // For example, make an API call with these filter parameters

  // Mock filtered projects
  return [
    { id: 1, title: "Sample Project 1", description: "Description 1" },
    { id: 2, title: "Sample Project 2", description: "Description 2" },
  ];
}

// Server Component (can be used in app directory)
interface ProjectsPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function ProjectsPage({
  searchParams,
}: ProjectsPageProps) {
  // Fetch data on the server
  const [filterData, filteredProjects] = await Promise.all([
    getFilterData(),
    getFilteredProjects(searchParams),
  ]);

  return (
    <div className="flex">
      {/* Client component that handles filter interactions */}
      <Suspense fallback={<div>Loading filters...</div>}>
        <FilterList {...filterData} />
      </Suspense>

      {/* Server-rendered content based on current filters */}
      <main className="flex-1 p-6">
        <h1>Filtered Projects</h1>

        {/* Display current active filters */}
        <div className="mb-4 rounded bg-blue-50 p-3">
          <h3 className="mb-2 font-semibold">Active Filters:</h3>
          {Object.entries(searchParams).length === 0 ? (
            <p className="text-gray-600">No filters applied</p>
          ) : (
            <ul className="space-y-1 text-sm">
              {searchParams.classBooks && (
                <li>
                  <strong>Class Books:</strong> {searchParams.classBooks}
                </li>
              )}
              {searchParams.fields && (
                <li>
                  <strong>Fields:</strong> {searchParams.fields}
                </li>
              )}
              {searchParams.courses && (
                <li>
                  <strong>Courses:</strong> {searchParams.courses}
                </li>
              )}
              {searchParams.categories && (
                <li>
                  <strong>Categories:</strong> {searchParams.categories}
                </li>
              )}
              {searchParams.types && (
                <li>
                  <strong>Types:</strong> {searchParams.types}
                </li>
              )}
            </ul>
          )}
        </div>

        {/* Display filtered projects */}
        <div className="grid gap-4">
          {filteredProjects.length === 0 ? (
            <p>No projects match the current filters.</p>
          ) : (
            filteredProjects.map((project) => (
              <div key={project.id} className="rounded-lg border p-4">
                <h3 className="font-semibold">{project.title}</h3>
                <p className="text-gray-600">{project.description}</p>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
