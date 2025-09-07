import ClientThemeProvider from "./ClientThemeProvider";

/**
 * ใช้ใน Server Components (เช่น layout.tsx)
 * children จะยังคงเป็น Server/Client ตามที่ประกาศไว้
 */
export default function UniversalThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClientThemeProvider>{children}</ClientThemeProvider>;
}
