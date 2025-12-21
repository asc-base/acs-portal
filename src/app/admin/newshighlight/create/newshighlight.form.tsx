"use client";
import { NewsMediaForm } from "@/components/newsmediaform";

interface StudentAuthLandingPageProps {
  apiBase: string;
}

const NewsHighlightForm = ({ apiBase }: StudentAuthLandingPageProps) => {
  return <NewsMediaForm type="newshighlight" apiBase={apiBase} />;
};

export default NewsHighlightForm;
