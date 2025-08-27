"use client";
import { NewsMediaForm } from "@/components/newsMediaForm";

const createAnnouncementManagementPage = () => {

    return (
        <div className="px-[32px] py-[28px]">
            <div className="flex flex-row items-end mb-4">
                <h3 className="font-bold">ข่าวประชาสัมพันธ์</h3>
                <h4> (สามารถเลือกได้สูงสุด 6 ข่าวสาร)</h4>
            </div>
            <NewsMediaForm type="announcement"/>
        </div>
        
    );
}

export default createAnnouncementManagementPage;
