import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Course } from "@/interface/course";

const CourseCard: React.FC<Course> = ({
  courseId,
  courseNameEn,
  courseNameTh,
  preCourses,
  credits,
  courseDetail
}) => {
  return (
    <Accordion
      sx={{
        backgroundColor: "var(--color-neutral02)",
        padding: 2,
        borderRadius: 2,
        border: "none",
        "&.Mui-expanded": {
          backgroundColor: "var(--color-neutral01)",
          border: "1px solid var(--color-neutral03)"
        },
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{
          alignItems: "flex-start",
          '& .MuiAccordionSummary-content': {
            margin: 0,
          },
          '& .MuiAccordionSummary-content.Mui-expanded': {
            margin: 0,
          },

        }}
      >
        <Box display="flex" flexDirection="column">
          <h2>{courseId} {courseNameEn}</h2>
          <h3>
            <span className="font-bold">ชื่อภาษาไทย :</span> {courseNameTh}
          </h3>
          {Array.isArray(preCourses) && preCourses.length > 0 && (
            <h3>
              <span className="font-bold">วิชาบังคับก่อน :</span>{" "}
              {preCourses.map((p) => `${p.courseId} ${p.courseNameEn}`).join(", ")}
            </h3>
          )}
          <h3>
            <span className="font-bold">ลักษณะการเรียน :</span> {credits}
          </h3>
        </Box>
      </AccordionSummary>

      <AccordionDetails sx={{ pt: 0 }}>
        <h4>{courseDetail}</h4>
      </AccordionDetails>
    </Accordion>
  );
};

export default CourseCard;