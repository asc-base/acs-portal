import { Box } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";
import type { UserPrefix } from "@/core/domain/user";

interface StudentDefaultAvatarProps {
  prefix?: UserPrefix | null;
  alt: string;
  sx?: SxProps<Theme>;
  fillContainer?: boolean;
}

const isFemalePrefix = (prefix?: UserPrefix | null) =>
  prefix?.nameTh.trim().startsWith("นาง") ?? false;

export const StudentDefaultAvatar = ({
  prefix,
  alt,
  sx,
  fillContainer = false,
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
        component="img"
        src={
          isFemale
            ? "/avatars/student-default-female.png"
            : "/avatars/student-default-male.png"
        }
        alt=""
        sx={{
          width: fillContainer ? "100%" : "72%",
          height: fillContainer ? "100%" : "auto",
          aspectRatio: "1",
          borderRadius: "50%",
          objectFit: "cover",
        }}
      />
    </Box>
  );
};
