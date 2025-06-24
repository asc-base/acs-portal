import { getCategories } from "../models/type";

export const fetchCategories = async () => {
    try {
        const result = await getCategories();
        if (result instanceof Error) throw result;
        return result;
    }
    catch (error) {
        console.error("Error fetching example data:", error);
        return [];
    }
};

