import type { ICurriculum } from "@/features/curriculum/domain/curriculum";
import type { IClassBook } from "@/features/classbook/domain/classbook";
import type { IProject } from "@/features/projects/domain/project";
import type { INews } from "@/features/news/domain/news";

interface BaseAdminCardProps {
    onView?: () => void;
    onDelete?: () => void;
    onEdit?: () => void;
}

export type AdminCardProps = BaseAdminCardProps & (
    | {
        type: "curriculum";
        data: ICurriculum
    }
    | {
        type: "classBook";
        data: IClassBook
    }
    | {
        type: "project";
        data: IProject
    } 
    | {
        type: "news";
        data: INews
    }
);



