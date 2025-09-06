"use client";
import { INews } from "@/core/domain/news";
import React from "react";

interface HomePageProps {
  initNewsActivity: INews[];
  initNewsComplete: INews[];
  initNewsActivityStudent: INews[];
}

const HomePage = ({
  initNewsActivity,
  initNewsComplete,
  initNewsActivityStudent,
}: HomePageProps) => {
  console.log("initNewsActivity:", initNewsActivity);
  console.log("initNewsComplete:", initNewsComplete);
  console.log("initNewsActivityStudent:", initNewsActivityStudent);

  return <div></div>;
};

export default HomePage;
