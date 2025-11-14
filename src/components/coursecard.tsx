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
        borderRadius: 4,
        border: "none",
        "&.Mui-expanded": {
          backgroundColor: "var(--color-neutral01)",
          border: "1px solid var(--color-neutral03)",
        },
        marginBottom: 4
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{
          alignItems: "flex-start",
          "& .MuiAccordionSummary-content": {
            margin: 0,
          },
          "& .MuiAccordionSummary-content.Mui-expanded": {
            margin: 0,
          },
        }}
      >
        <Box display="flex" flexDirection="column" marginBottom={2}>
          <h2>
            {courseId} {courseNameEn}
          </h2>
          <h3>
            <span className="font-bold">ชื่อภาษาไทย :</span> {courseNameTh}
          </h3>
          {Array.isArray(preCourses) && preCourses.length > 0 && (
            <h3>
              <span className="font-bold">วิชาบังคับก่อน :</span>{" "}
              {preCourses
                .map((p) => `${p.courseId} ${p.courseNameEn}`)
                .join(", ")}
            </h3>
          )}
          <h3>
            <span className="font-bold">ลักษณะการเรียน :</span> {credits}
          </h3>
        </Box>
      </AccordionSummary>

      <AccordionDetails>
          <h3 className="max-h-50 overflow-y-scroll whitespace-pre-wrap break-words leading-relaxed">{courseDetail}</h3>
      </AccordionDetails>
    </Accordion>
  );
}

export default CourseCard;
