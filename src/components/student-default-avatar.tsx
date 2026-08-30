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
        component="img"
        src={
          isFemale
            ? "/avatars/student-default-female.jpg"
            : "/avatars/student-default-male.jpg"
        }
        alt=""
        sx={{
          width: "72%",
          aspectRatio: "1",
          borderRadius: "50%",
          objectFit: "cover",
        }}
      />
    </Box>
  );
};
