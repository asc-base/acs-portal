export interface Course {
    courseId: string;
    courseNameTh: string;
    courseDetail: string;
    courseNameEn: string;
    credits: string;
    preCourses: { courseId: string;  courseNameEn: string }[];
}
