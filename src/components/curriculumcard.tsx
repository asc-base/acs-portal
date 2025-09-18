import Image, { StaticImageData } from "next/image";
import { FC } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  useTheme,
  useMediaQuery,
} from "@mui/material";

interface ICurriculumCard {
  year: string;
  description: string;
  image: StaticImageData;
  downloadLink?: string;
}

export const CurriculumCard: FC<ICurriculumCard> = ({
  year,
  description,
  image,
  downloadLink,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        borderRadius: 2,
        overflow: "hidden",
        boxShadow: 3,
        minHeight: isMobile ? "auto" : 300,
      }}
    >
      <CardContent
        sx={{
          flex: isMobile ? "none" : 1,
          backgroundColor: "#1a1a3e",
          color: "white",
          order: isMobile ? 2 : 1,
          p: 3,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Typography
          variant= "h6"
          gutterBottom
          sx={{
            fontWeight: "bold",
            color: "white",
            mb: 2,
          }}
        >
          หลักสูตรใหม่ปี พ.ศ. {year}
        </Typography>

        <Typography
          variant="body1"
          sx={{
            lineHeight: 1.6,
            color: "#e0e0e0",
            mb: 3,
            fontSize: isMobile ? "16px" : "18px",
          }}
        >
          {description}
        </Typography>

        {downloadLink && (
          <Button
            variant="outlined"
            href={downloadLink}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              borderColor: "white",
              color: "white",
              alignSelf: "flex-start",
              px: 3,
              py: 1.5,
              "&:hover": {
                backgroundColor: "white",
                color: "#1a1a3e",
                borderColor: "white",
              },
            }}
          >
            อ่านรายละเอียดเพิ่มเติม
          </Button>
        )}
      </CardContent>

      <Box
        sx={{
          width: isMobile ? "100%" : "50%",
          height: isMobile ? 200 : "auto",
          position: "relative",
          order: isMobile ? 1 : 2,
          minHeight: isMobile ? 200 : 300,
        }}
      >
        <Image
          src={image}
          alt={`Curriculum ${year}`}
          fill
          style={{ objectFit: "cover" }}
        />
      </Box>
    </Card>
  );
};
