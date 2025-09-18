import { getTypeCourses } from "../models/typecourse";

export const fetchTypeCourses = async () => {
    try {
        const result = await getTypeCourses();
        if (result instanceof Error) throw result;
        return result;
    }
    catch (error) {
        console.error("Error fetching type course data:", error);
        return [];
    }
};
