"use client";
import { NewsMediaForm } from "@/components/newsmediaform";

interface StudentAuthLandingPageProps {
  apiBase: string;
}

const AnnouncementForm = ({ apiBase }: StudentAuthLandingPageProps) => {
  return <NewsMediaForm type="announcement" apiBase={apiBase} />;
};

export default AnnouncementForm;
