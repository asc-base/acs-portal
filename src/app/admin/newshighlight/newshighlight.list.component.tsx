"use client";
import { AnnouncementCard } from "@/components/announcementcard";
import { INewsMedia } from "@/core/domain/news";

interface NewsHighlightListComponentProps {
  newsHighlight: INewsMedia[];
}

const NewsHighlightListComponent = ({
  newsHighlight,
}: NewsHighlightListComponentProps) => {
  const displayNewsHighlight = [...newsHighlight];
  while (displayNewsHighlight.length < 5) {
    displayNewsHighlight.push({
      news: { title: "" },
      image: "",
    } as INewsMedia);
  }

  return (
    <div className="min-h-screen p-6">
      <div className="mb-6 flex items-center gap-2">
        <h3 className="font-bold">ข่าว Highlight</h3>
        <h4>(สามารถเลือกได้สูงสุด 5 ข่าวสาร)</h4>
      </div>

      <div className="grid max-w-7xl grid-cols-3 justify-start gap-6">
        {displayNewsHighlight.map((highlight, index) => (
          <div key={index} className="cursor-pointer">
            <AnnouncementCard
              title={highlight.news.title}
              image={highlight.image}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsHighlightListComponent;
