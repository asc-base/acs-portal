import React from "react";
import ResetPasswordAuthLandingPage from "./resetpassword.auth.landingpage";

interface PageProps {
  searchParams: Promise<{
    referenceCode: string;
  }>;
}

const Page = async function name({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;

  const referenceCode = resolvedSearchParams.referenceCode;

  return (
    <div className="w-full">
      <ResetPasswordAuthLandingPage referenceCode={referenceCode} />
    </div>
  );
};

export default Page;
