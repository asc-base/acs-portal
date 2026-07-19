import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import GitHubIcon from "@mui/icons-material/GitHub";
import CloseIcon from "@mui/icons-material/Close";
import { Typography, Chip } from "@mui/material";
import Image from "next/image";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { IStudent } from "@/core/domain/student";
import { IClassBook } from "@/core/domain/classbook";

interface StudentModalProps {
  student: IStudent;
  Open: boolean;
  onClose: () => void;
  classBook: IClassBook | null;
}

export const StudentModal: React.FC<StudentModalProps> = ({
  student,
  Open,
  onClose,
  classBook,
}) => {
  const [activeTab, setActiveTab] = useState<"course" | "other">("course");

  const courseProjectsMock = [
    "Parking management program “Peter Parking” from Database and Object-Oriented Programming courses as a Project Manager and UI/UX Designer.",
    "Web E-commerce semester project (from Web Programming course) as a Full-stack Developer",
    "Mobile Application “X-culture” (from Software Engineering course) as a Project Manager",
    "Website for Digital Illustration Portfolio and Marketplace (Senior Project collaboration with Dek-D interactive Co.,Ltd) as a Project manager, Business Analyst and UX/UI Designer",
    "IdentityV Wiki” as a Project manager, UX/UI Designer and Swift Developer (from Mobile application development course)",
    "DD Coach” Website (Internship project At Dek-D interactive Co.,Ltd) as a UX/UI Designer.",
    "IdentityV Wiki” as a Project manager, UX/UI Designer and Swift",
  ];

  const otherProjectsMock = [
    "Personal portfolio website built with Next.js and Tailwind CSS.",
    "Contribution to open-source React libraries.",
    "Participation in local hackathons.",
  ];

  return (
    <Modal open={Open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "95%", sm: "85%", md: "80%", lg: "70%" },
          maxWidth: 1000,
          bgcolor: "var(--color-neutral01)",
          borderRadius: "24px",
          boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.08)",
          p: { xs: 3, sm: 4, md: 5 },
          outline: "none",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        {/* Close Button */}
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 20,
            right: 20,
            color: "var(--color-neutral05)",
            "&:hover": {
              color: "var(--color-primary01)",
            },
          }}
        >
          <CloseIcon sx={{ fontSize: 24 }} />
        </IconButton>

        {/* Two-Column Grid */}
        <div className="flex flex-col gap-8 md:flex-row pt-4">

          {/* Left Panel: Profile and Skills */}
          <div className="flex flex-col gap-6 md:w-[35%] w-full">

            {/* Profile Card */}
            <div className="flex flex-col items-center rounded-2xl border border-neutral02 bg-white p-6 shadow-sm">
              <div className="mb-4 overflow-hidden rounded-2xl w-full flex justify-center">
                {student.user.imageUrl ? (
                  <Image
                    src={student.user.imageUrl}
                    alt={`${student.user.firstNameTh} ${student.user.lastNameTh}`}
                    width={220}
                    height={230}
                    className="h-[230px] w-full max-w-[220px] object-cover rounded-2xl"
                  />
                ) : (
                  <AccountCircleIcon
                    sx={{
                      fontSize: 220,
                      color: "var(--color-neutral03)",
                    }}
                  />
                )}
              </div>

              <Typography className="!text-lg !font-bold !text-neutral05 text-center mb-1">
                {student.user.firstNameTh} {student.user.lastNameTh} ({student.user.nickName || "-"})
              </Typography>
              <Typography className="!text-sm !text-neutral04 text-center mb-4">
                {student.studentCode} รุ่น {classBook?.classof || "-"}
              </Typography>

              {/* Social Links */}
              <div className="flex gap-3 justify-center">
                {student.facebook && (
                  <IconButton
                    component="a"
                    href={student.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ p: 0.5, color: "var(--color-neutral04)", "&:hover": { color: "#1877F2" } }}
                  >
                    <FacebookIcon sx={{ fontSize: 22 }} />
                  </IconButton>
                )}
                {student.linkedin && (
                  <IconButton
                    component="a"
                    href={student.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ p: 0.5, color: "var(--color-neutral04)", "&:hover": { color: "#0A66C2" } }}
                  >
                    <LinkedInIcon sx={{ fontSize: 22 }} />
                  </IconButton>
                )}
                {student.github && (
                  <IconButton
                    component="a"
                    href={student.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ p: 0.5, color: "var(--color-neutral04)", "&:hover": { color: "#181717" } }}
                  >
                    <GitHubIcon sx={{ fontSize: 22 }} />
                  </IconButton>
                )}
                {student.instagram && (
                  <IconButton
                    component="a"
                    href={student.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ p: 0.5, color: "var(--color-neutral04)", "&:hover": { color: "#E1306C" } }}
                  >
                    <InstagramIcon sx={{ fontSize: 22 }} />
                  </IconButton>
                )}
              </div>
            </div>

            {/* Skills Card */}
            {student.skills && student.skills.length > 0 && (
              <div className="rounded-2xl border border-neutral02 bg-white p-6 shadow-sm">
                <Typography className="!text-sm !font-bold !text-neutral05 !mb-3">
                  Skills
                </Typography>
                <div className="flex flex-wrap gap-2">
                  {student.skills.map((skill) => (
                    <Chip
                      key={skill}
                      label={skill}
                      sx={{
                        backgroundColor: "var(--color-neutral02)",
                        color: "var(--color-neutral05)",
                        borderRadius: "8px",
                        fontSize: "0.75rem",
                        height: "26px",
                        fontWeight: 500,
                        border: "1px solid var(--color-neutral03)",
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Panel: Project Tabs and Scrollable List */}
          <div className="flex-1 flex flex-col md:w-[65%] w-full">

            {/* Tab Headers */}
            <div className="flex border-b border-neutral02 mb-6">
              <button
                onClick={() => setActiveTab("course")}
                className={`flex-1 pb-3 text-center font-bold text-sm transition-colors border-b-2 ${activeTab === "course"
                  ? "border-primary01 text-primary01"
                  : "border-transparent text-neutral04 hover:text-neutral05"
                  }`}
              >
                โปรเจกต์ในหลักสูตร
              </button>
              <button
                onClick={() => setActiveTab("other")}
                className={`flex-1 pb-3 text-center font-bold text-sm transition-colors border-b-2 ${activeTab === "other"
                  ? "border-primary01 text-primary01"
                  : "border-transparent text-neutral04 hover:text-neutral05"
                  }`}
              >
                โปรเจกต์อื่นๆ
              </button>
            </div>

            {/* Scrollable Project List */}
            <div className="flex-1 max-h-[420px] overflow-y-auto pr-3 custom-scrollbar">
              <ul className="list-disc pl-5 text-neutral05 space-y-4">
                {activeTab === "course" ? (
                  courseProjectsMock.map((project, idx) => (
                    <li key={idx} className="leading-relaxed text-sm">
                      {project}
                    </li>
                  ))
                ) : (
                  otherProjectsMock.map((project, idx) => (
                    <li key={idx} className="leading-relaxed text-sm">
                      {project}
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        </div>
      </Box>
    </Modal>
  );
};
