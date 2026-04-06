import { ICurriculum } from "@/core/domain/curriculum";
import { IClassBook } from "@/core/domain/classbook";
import { IProject } from "@/core/domain/project";
import { INews } from "@/core/domain/news";

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



