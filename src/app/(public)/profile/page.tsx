import React from "react";
import ProfileForm from "./profileform";

const page = async () => {

  const mockUserData = {
    studentId: "66090500403",
    nickname: "เลิฟ",
    fullNameTh: "ณัฐนิชา อนันต์พอร์ดพล",
    fullNameEn: "Nattanischa Anmporsdpsl",
  };

  return (
    <ProfileForm user={mockUserData} />
  );

};

export default page;
