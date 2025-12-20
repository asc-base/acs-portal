"use client";
import { NewsMediaForm } from "@/components/newsMediaForm";

interface StudentAuthLandingPageProps {
  apiBase: string;
}

const NewsHighlightForm = ({ apiBase }: StudentAuthLandingPageProps) => {
  return <NewsMediaForm type="newshighlight" apiBase={apiBase} />;
};

export default NewsHighlightForm;
