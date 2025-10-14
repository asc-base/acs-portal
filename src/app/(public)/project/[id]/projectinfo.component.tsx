"use client";

import React, { useState } from "react";
import { Breadcrumbs } from "@mui/material";
import Link from "next/link";
import Image from "next/image";
import { IconButton } from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { StudentCard } from "@/components/studentcard";

const images = [
    "https://picsum.photos/id/20/800/400",
    "https://picsum.photos/id/21/800/400",
    "https://picsum.photos/id/22/800/400",
    "https://picsum.photos/id/23/800/400",
    "https://picsum.photos/id/24/800/400",
]

const ProjectInfoComponent = () => {
    const [index, setIndex] = useState(0);

    const handlePrev = () => {
        setIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    const getVisibleImages = () => {
        const result = [];
        for (let i = 0; i < 3; i++) {
            result.push(images[(index + i) % images.length]);
        }
        return result;
    };

    return (
        <div className="container mx-auto px-16 py-5">
            {/*Breadcrumbs*/}
            <div className="flex flex-col items-start justify-start gap-2 mb-4">
                <Breadcrumbs aria-label="breadcrumb" separator=">>" className="mb-4">
                    <Link href="/">หน้าหลัก</Link>
                    <Link href="/project"><p>ผลงานนักศึกษา</p></Link>
                    <p>Projectname</p>
                </Breadcrumbs>
            </div>
            {/*Image banner*/}
            <div className="mb-4">
                <Image
                    src="https://picsum.photos/id/20/1152/400"
                    alt="Image"
                    width={1152}
                    height={400}
                    style={{ width: "100%", height: "auto" }}
                />
            </div>
            {/*Project detail*/}
            <div className="mb-4">
                <h5>Web Application / Education</h5>
                <h2 className="font-bold">Heading or Project Name</h2>
                <h4>ทัวร์แอดมิชชั่นจึ๊กชีสเห็นด้วย รีเสิร์ชพริตตี้ ต่อรองเชอร์รี่ ล้มเหลวธรรมามาร์ชโชห่วย ตี๋โกลด์ มายองเนสหน่อมแน้มยิมสะบึมแรลลี่ เซ็กส์แมชีนติวคาสิโนฮันนีมูน อุตสาหการดยุก แจ็กพ็อตวัจนะ จังโก้เทรลเล่อร์ฟอร์มสกรัม เอ๋อพาร์ วิภัชภาคเซนเซอร์ กุมภาพันธ์น็อกฮาร์ดบ๊อบฮาราคีรี อุปนายิกา ก๊วนมิลค์โฮมวิทย์ช็อต โดนัทฮ็อตด็อกมินต์อ่อนด้อย ช็อปเปอร์ซูเอี๋ยรอยัลตี้</h4>
            </div>
            {/*Presentaion section*/}
            <div className="flex flex-col justify-around md:flex-row">
                <div>
                    <h2 className="font-bold mb-2">ตัวอย่างงานนำเสนอ</h2>
                    <video
                        width={600}
                        height={350}
                        controls
                        autoPlay={false}
                        muted
                        loop
                    >
                        <source src={"/fallback-video.mp4"} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>
                <div>
                    <h2 className="font-bold mb-2">ข้อมูลเพิ่มเติม</h2>
                    <div className="flex flex-col items-center">
                        {/*Main*/}
                        <Image
                            src={images[index]}
                            alt="main"
                            width={550}
                            height={200}
                        />

                        {/*Slider*/}
                        <div className="flex flex-row justify-between mt-4">
                            <IconButton onClick={handlePrev}>
                                <ArrowBackIos />
                            </IconButton>
                            <div className="flex flex-row justify-center gap-x-1">
                                {getVisibleImages().map((img, i) => (
                                    <Image
                                        key={i}
                                        src={img}
                                        alt={`thumb-${i}`}
                                        width={140}
                                        height={90}
                                    />
                                ))}
                            </div>
                            <IconButton onClick={handleNext}>
                                <ArrowForwardIos />
                            </IconButton>
                        </div>
                    </div>
                </div>
            </div>
            {/*File*/}
            <div>
                <h2>Files and.....</h2>
                <div className="flex flex-row">
                    <h4>Git: </h4>
                    <a href="#" className="text-primary05 underline break-all">
                        https://www.lisasuefischer.com/#/loppet-winter-festival/
                    </a>
                </div>
                <div className="flex flex-row">
                    <h4>Presentation: </h4>
                    <a href="#" className="text-primary05 underline break-all">
                        https://www.lisasuefischer.com/#/loppet-winter-festival/
                    </a>
                </div>
                <div className="flex flex-row">
                    <h4>Document: </h4>
                    <a href="#" className="text-primary05 underline break-all">
                        https://www.lisasuefischer.com/#/loppet-winter-festival/
                    </a>
                </div>
                <div className="flex flex-row">
                    <h4>Techstack: </h4>
                    <a href="#" className="text-primary05 underline break-all">
                        https://www.lisasuefischer.com/#/loppet-winter-festival/
                    </a>
                </div>
            </div>
            {/*Member*/}
            {/* <StudentCard /> */}

        </div >
    );
}

export default ProjectInfoComponent;