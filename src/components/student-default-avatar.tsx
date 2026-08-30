import { Box } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";
import type { UserPrefix } from "@/core/domain/user";

interface StudentDefaultAvatarProps {
  prefix?: UserPrefix | null;
  alt: string;
  sx?: SxProps<Theme>;
}

const isFemalePrefix = (prefix?: UserPrefix | null) =>
  prefix?.nameTh.trim().startsWith("นาง") ?? false;

export const StudentDefaultAvatar = ({
  prefix,
  alt,
  sx,
}: StudentDefaultAvatarProps) => {
  const isFemale = isFemalePrefix(prefix);

  return (
    <Box
      role="img"
      aria-label={alt}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        bgcolor: "var(--color-neutral02)",
        ...sx,
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: "72%",
          aspectRatio: "1",
          overflow: "hidden",
          borderRadius: "50%",
        }}
      >
        <Box
          component="img"
          src="/avatars/student-default-avatars.jpg"
          alt=""
          sx={{
            position: "absolute",
            width: "500%",
            maxWidth: "none",
            height: "auto",
            left: isFemale ? "-400%" : "-100%",
            top: isFemale ? "auto" : 0,
            bottom: isFemale ? 0 : "auto",
          }}
        />
      </Box>
    </Box>
  );
};
