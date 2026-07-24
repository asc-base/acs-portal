import React from "react";
import ResetPasswordAuthLandingPage from "./resetpassword.auth.landingpage";
import { baseUrl } from "@/infra/container";
import { authService } from "@/infra/container";
import LinkExpireLandingPage from "./linkexpire.landingpage";

interface PageProps {
  searchParams: Promise<{
    referenceCode: string;
  }>;
}

const Page = async function name({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const referenceCode = resolvedSearchParams.referenceCode;
  const credential = await authService.getCredentials(referenceCode);

  const isExpired = new Date() > new Date(credential.data.expiredAt);

  return (
    <div className="w-full">
      {isExpired ? (
        <LinkExpireLandingPage />
      ) : (
        <ResetPasswordAuthLandingPage
          referenceCode={referenceCode}
          apiBase={baseUrl}
        />
      )}
    </div>
  );
};

export default Page;
