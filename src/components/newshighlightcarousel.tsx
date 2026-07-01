import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import Image from "next/image";
import { INewsInformation } from "@/core/domain/news";
import { useState, useEffect } from "react";

interface NewsHighlightCarouselProps {
  newsHighlight: INewsInformation[];
}

const NewsHighlightCarousel = ({
  newsHighlight,
}: NewsHighlightCarouselProps) => {
  const [rePositionNews, setPositions] = useState(newsHighlight);

  useEffect(() => {
    const interval = setInterval(() => {
      setPositions((prev) => {
        const [first, ...rest] = prev;
        return [...rest, first];
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const setImagePattern = (index: number) => {
    if (newsHighlight.length === 4) {
      if (index < 2) return { cols: 1, rows: 1 };
      return { cols: 2, rows: 1 };
    } else if (newsHighlight.length === 3) {
      return { cols: 2, rows: 1 };
    } else return { cols: 1, rows: 1 };
  };

  return (
    <ImageList
      cols={5}
      rowHeight={200}
      gap={14}
      sx={{
        width: "100%",
        "& .MuiImageListItemBar-title": {
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          whiteSpace: "normal",
        },
      }}
    >
      {rePositionNews.map((item, index) => {
        if (index === 0) {
          return (
            <ImageListItem
              key={index}
              cols={3}
              rows={2}
              sx={{ borderRadius: "10px", overflow: "hidden" }}
            >
              <Image
                src={item.news.highlightURL || item.news.thumbnailURL}
                alt={item.news.title}
                fill
                style={{ objectFit: "cover" }}
              />
              <ImageListItemBar title={item.news.title} />
            </ImageListItem>
          );
        }
        const { cols, rows } = setImagePattern(index - 1);

        return (
          <ImageListItem
            key={index}
            cols={cols}
            rows={rows}
            sx={{ borderRadius: "10px", overflow: "hidden" }}
          >
            <Image
              src={item.news.highlightURL || item.news.thumbnailURL}
              alt={item.news.title}
              fill
              style={{ objectFit: "cover" }}
            />
            <ImageListItemBar title={item.news.title} />
          </ImageListItem>
        );
      })}
    </ImageList>
  );
};

export default NewsHighlightCarousel;
