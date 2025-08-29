"use client";
import React from "react";
import IMAGE from "../../../../public/ImageLoginAdmin.svg";
import Image from "next/image";

const AuthAdminPage = () => {
  return (
    <div className="min-h-screen">
      <div className="grid h-screen grid-cols-1 md:grid-cols-2">
        <div className="flex h-full justify-center">
          <Image src={IMAGE} alt="Login Image" fill />
        </div>
      </div>
    </div>
  );
};

export default AuthAdminPage;
