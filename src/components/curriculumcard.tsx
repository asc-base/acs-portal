import Image from "next/image";
import { FC } from "react";
import {
  Card,
  CardContent,
  Button,
  Box,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import Link from "next/link";
import { ICurriculum } from "@/core/domain/curriculum";
import PanoramaIcon from "@mui/icons-material/Panorama";

interface ICurriculumCard {
  curriculum: ICurriculum;
  focusCurriculum: number;
  setFocusCurriculum?: () => void;
}

export const CurriculumCard: FC<ICurriculumCard> = ({
  curriculum,
  focusCurriculum,
  setFocusCurriculum,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const { id, year, description, imageUrl, fileUrl } = curriculum;
  const isFocused = focusCurriculum === id;

  return (
    <Card
      onClick={setFocusCurriculum}
      sx={{
        display: "flex",
        borderRadius: 4,
        overflow: "hidden",
        boxShadow: 3,
        height: 248,
        width: "100%",
        maxWidth: 552,
        mx: "auto",
        cursor: "pointer",
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: isMobile ? 0 : 200,
          height: isMobile ? 200 : "auto",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: !imageUrl ? "var(--color-neutral02)" : "transparent",
        }}
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={`Curriculum ${year}`}
            fill
            style={{ objectFit: "cover" }}
          />
        ) : (
          <PanoramaIcon
            sx={{
              fontSize: 48,
              color: "var(--color-neutral04)",
            }}
          />
        )}
      </Box>

      <CardContent
        sx={{
          flex: 1,
          backgroundColor: isFocused
            ? "var(--color-primary01)"
            : "var(--color-neutral03)",
          color: "var(--color-neutral01)",
          p: 3,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <p className="text-h2 mb-2 font-bold">หลักสูตรใหม่ปี พ.ศ. {year}</p>
          <p className="text-h4">สำหรับนักศึกษา</p>
          <p className="text-h4 line-clamp-1">{description}</p>
        </Box>
        <Button
          variant="outlined"
          sx={{
            border: `1px solid ${isFocused ? "var(--color-secondary02)" : "var(--color-primary01)"}`,
            color: isFocused
              ? "var(--color-secondary02)"
              : "var(--color-primary01)",
            alignSelf: "flex-end",
            px: 3,
            py: 1.5,
          }}
        >
          <Link href={fileUrl} target="_blank" rel="noopener noreferrer">
            อ่านรายละเอียดเพิ่มเติม
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};
