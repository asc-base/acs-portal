import React from "react";
import ProfileForm from "./profileform";
import { studentService } from "@/infra/container";

const page = async () => {

  const studentData = await studentService.getSrudentByUserId(1);

  return (
    <ProfileForm studentData={studentData} />
  );

};

export default page;
