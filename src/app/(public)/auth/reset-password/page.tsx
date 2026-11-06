import React from "react";
import ResetPasswordAuthLandingPage from "@/features/auth/components/public/reset-password/resetpassword.auth.landingpage";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PageProps {
  searchParams: Promise<{
    token?: string | string[];
    error?: string | string[];
  }>;
}

const Page = async function name({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;

  const token = resolvedSearchParams.token;
  const hasError = resolvedSearchParams.error !== undefined;
  const validToken =
    !hasError && typeof token === "string" && token.trim().length > 0
      ? token
      : null;

  return (
    <div className="w-full">
      <ResetPasswordAuthLandingPage token={validToken} />
    </div>
  );
};

export default Page;
