import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import GitHubIcon from '@mui/icons-material/GitHub';
import CloseIcon from '@mui/icons-material/Close';
import { Tabs, Tab, Typography } from '@mui/material';
import { IStudent } from '@/interface/student';

interface StudentModalProps {
  student: IStudent;
  Open: boolean;
  onClose: () => void;
}

export const StudentModal: React.FC<StudentModalProps> = ({ student, Open, onClose }) => {

  return (
    <Modal open={Open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: '80%', md: '60%' },
          maxWidth: 1073,
          bgcolor: 'var(--color-neutral01)',
          borderRadius: { xs: 2, sm: 4, md: 4 },
          p: { xs: 3, sm: 4, md: 4 },
          outline: 'none',
          overflowY: 'auto',
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', top: 16, right: 16, color: 'var(--color-primary01)' }}
        >
          <CloseIcon sx={{ fontSize: { xs: 16, md: 24 } }} />
        </IconButton>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 pt-6 ">
          <div className="flex flex-row md:flex-col items-center gap-3 p-4 md:p-0 shadow-lg md:shadow-none rounded-lg">
            <div>
              <img
                src={student.user.imageUrl}
                alt={`${student.user.firstNameTh} ${student.user.lastNameTh}`}
                className="w-[96px] h-[96px] md:w-[256px] md:h-[256px] lg:w-[360px] lg:h-[380px] rounded-full md:rounded-xl object-cover "
              />
            </div>

            <div className="flex flex-col items-center gap-2">
              <Typography className="!text-h4 md:!text-h3 lg:!text-h2 !font-bold !text-primary01">
                {student.user.firstNameTh} {student.user.lastNameTh}
              </Typography>
              <Typography className="!text-h5 md:!text-h4 lg:!text-h3 !text-primary01">
                {student.user.nickName} {student.studentId} รุ่น {student.classBook.classof}
              </Typography>

              <div className="flex gap-2 flex-wrap">
                {student.facebook && (
                  <IconButton
                    component="a"
                    href={student.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ p: 0, color: 'var(--color-neutral04)' }}
                  >
                    <FacebookIcon sx={{ fontSize: { xs: 16, sm: 24, md: 24, lg: 32 } }} />
                  </IconButton>
                )}
                {student.linkin && (
                  <IconButton
                    component="a"
                    href={student.linkin}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ p: 0, color: 'var(--color-neutral04)' }}
                  >
                    <LinkedInIcon sx={{ fontSize: { xs: 16, sm: 24, md: 24, lg: 32 } }} />
                  </IconButton>
                )}
                {student.github && (
                  <IconButton
                    component="a"
                    href={student.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ p: 0, color: 'var(--color-neutral04)' }}
                  >
                    <GitHubIcon sx={{ fontSize: { xs: 16, sm: 24, md: 24, lg: 32 } }} />
                  </IconButton>
                )}
                {student.instragram && (
                  <IconButton
                    component="a"
                    href={student.instragram}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ p: 0, color: 'var(--color-neutral04)' }}
                  >
                    <InstagramIcon sx={{ fontSize: { xs: 16, sm: 24, md: 24, lg: 32 } }} />
                  </IconButton>
                )}
              </div>
            </div>
          </div>

          <div className="flex-1 md:pl-4">
            <Typography className="!text-h3 md:!text-h2 !font-bold !text-primary01 !mb-2">
              โปรเจกต์ในรายวิชา
            </Typography>


            {/* Mock title project in course*/}
            <ul className="list-disc pl-6 max-h-[450px] overflow-y-auto px-4 pr-2 text-h5 md:text-h4">
              <li>Parking management program “Peter Parking” from Database and Object-Oriented Programming courses as a Project Manager and UI/UX Designer.</li>
              <li>Web E-commerce semester project (from Web Programming course) as a Full-stack Developer</li>
              <li>
                Mobile Application “X-culture” (from Software Engineering course) as a Project Manager</li>
              <li>Website for Digital Illustration Portfolio and Marketplace (Senior Project collaboration with Dek-D interactive Co.,Ltd) as a Project manager, Business Analyst and UX/UI Designer</li>
              <li>IdentityV Wiki” as a Project manager, UX/UI Designer and Swift Developer (from Mobile application development course)</li>
              <li>DD Coach” Website (Internship project At Dek-D interactive Co.,Ltd) as a UX/UI Designer.</li>
              <li>IdentityV Wiki” as a Project manager, UX/UI Designer and Swift </li>
              
            </ul>

            {/* Show project titel that come from real data */}

            {/* {student.projects.length === 0 ? (
              <Typography className="text-gray-500 !text-h5 md:!text-h4">
                ไม่พบโปรเจกต์
              </Typography>
            ) : (
              <ul className="list-disc pl-6 max-h-[450px] overflow-y-auto px-4 pr-2">
                {student.projects.map((project) => (
                  <li key={project.id} className="mb-2">
                    <Typography className="text-h5 md:text-h4">
                      {project.title}
                    </Typography>
                  </li>
                ))}
              </ul>
            )} */}

          </div>
        </div>
      </Box>
    </Modal>
  );
};
