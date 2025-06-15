import React from "react";
import hero from "../../../public/hero.jpg";
import { HeroCard } from "@/components/herocard";
import { NewsCard } from "@/components/newscard";

const page = () => {
  const description =
    "คณะวิทยาศาสตร์ ภาควิชาคณิตศาสตร์/มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าธนบุรี";

  return (
    <>
      <HeroCard image={hero} description={description} />
      <div className="container mx-auto px-16">
        <NewsCard
          title="ชื่อข่าวและอะไรรายละเอียดสักอย่าง เนื้อหาประมาณนึง"
          createAt="2023-08-30"
          image="https://images.unsplash.com/photo-1728044849277-9cb3cd94e729?q=80&w=1934&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        />
      </div>
    </>
  );
};

export default page;
